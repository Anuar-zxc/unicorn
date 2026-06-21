import { completeGemini } from "@/lib/gemini";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getContractType } from "@/lib/contract-types";
import {
  buildSystemPrompt,
  normalizeResponseMode
} from "@/lib/ai-prompts";
import {
  normalizeAILanguage,
  type AILanguage
} from "@/lib/ai-language";

type Message = { role: "assistant" | "user"; content: string };

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  if (body.action === "start") {
    if (body.sessionId) {
      const { data: existing } = await supabase
        .from("draft_sessions")
        .select("*")
        .eq("id", body.sessionId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) {
        return Response.json({
          sessionId: existing.id,
          conversation: existing.conversation,
          draft: existing.current_draft,
          isComplete: existing.status === "complete"
        });
      }
    }

    const contractType = getContractType(String(body.contractTypeId));
    const accountType = body.accountType === "lawyer" ? "lawyer" : "individual";
    if (!contractType || !contractType.available_for.includes(accountType)) {
      return Response.json({ error: "Contract type is not available." }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan,ai_language")
      .eq("id", user.id)
      .maybeSingle();
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("draft_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString());
    if ((profile?.plan ?? "free") === "free" && (count ?? 0) >= 1) {
      return Response.json(
        { error: "PLAN_LIMIT: The free plan includes one contract build per month." },
        { status: 403 }
      );
    }

    const language = normalizeAILanguage(body.language ?? profile?.ai_language);
    const firstQuestion = firstQuestionFor(contractType.name, accountType, language);
    const conversation: Message[] = [{ role: "assistant", content: firstQuestion }];
    const { data: session, error } = await supabase
      .from("draft_sessions")
      .insert({
        user_id: user.id,
        contract_type: contractType.id,
        account_type: accountType,
        ai_language: language,
        conversation
      })
      .select("id")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ sessionId: session.id, firstQuestion, conversation });
  }

  if (body.action === "continue") {
    const { data: session, error: sessionError } = await supabase
      .from("draft_sessions")
      .select("*")
      .eq("id", body.sessionId)
      .eq("user_id", user.id)
      .single();
    if (sessionError || !session) {
      return Response.json({ error: "Drafting session not found." }, { status: 404 });
    }
    const contractType = getContractType(session.contract_type);
    if (!contractType) return Response.json({ error: "Contract type not found." }, { status: 404 });

    const language = normalizeAILanguage(body.language ?? session.ai_language);
    const conversation: Message[] = [
      ...(Array.isArray(session.conversation) ? session.conversation : []),
      { role: "user", content: String(body.answer ?? "") }
    ];
    const userAnswers = conversation.filter((message) => message.role === "user").length;
    const targetAnswers = session.account_type === "lawyer" ? 4 : 6;
    const generated = await generateWizardTurn({
      contractName: contractType.name,
      accountType: session.account_type,
      language,
      conversation,
      shouldFinish: userAnswers >= targetAnswers
    });
    const assistantMessage = generated.isComplete
      ? language === "ru" ? "Договор готов. Проверьте текст справа." : "Your contract is ready. Review it on the right."
      : generated.nextQuestion;
    const nextConversation = [
      ...conversation,
      { role: "assistant" as const, content: assistantMessage }
    ];
    const { error: updateError } = await supabase
      .from("draft_sessions")
      .update({
        conversation: nextConversation,
        current_draft: generated.draft || session.current_draft,
        status: generated.isComplete ? "complete" : "in_progress",
        ai_language: language,
        updated_at: new Date().toISOString()
      })
      .eq("id", session.id)
      .eq("user_id", user.id);
    if (updateError) return Response.json({ error: updateError.message }, { status: 500 });
    return Response.json({
      isComplete: generated.isComplete,
      draft: generated.draft || session.current_draft,
      nextQuestion: generated.nextQuestion,
      message: generated.isComplete ? assistantMessage : undefined
    });
  }

  return Response.json({ error: "Invalid action." }, { status: 400 });
}

async function generateWizardTurn({
  contractName,
  accountType,
  language,
  conversation,
  shouldFinish
}: {
  contractName: string;
  accountType: "lawyer" | "individual";
  language: AILanguage;
  conversation: Message[];
  shouldFinish: boolean;
}) {
  const system = buildSystemPrompt(
    `You are Lexo's conversational contract drafting assistant creating a ${contractName}.
${accountType === "lawyer"
  ? "The user is a lawyer. Ask short, technically precise questions and assume legal literacy."
  : "The user is not a lawyer. Ask one simple question at a time, avoid jargon, and briefly clarify why the information matters."}
Gather parties, subject matter, payment or consideration, timing, termination or breach consequences, jurisdiction, and any unusual terms.
Return valid JSON only with: isComplete (boolean), nextQuestion (string), draft (string).
When isComplete is false, ask exactly one next question. You may include an evolving partial draft after at least two answers.
When isComplete is true, draft the full agreement with numbered sections, defined terms where useful, governing law, signature blocks, bracketed placeholders for missing facts, and an AI-review disclaimer translated into the output language.
For Kazakhstan jurisdiction, use Kazakhstan legal drafting conventions. If English is requested for Kazakhstan law, add a note recommending a Russian or Kazakh version.`,
    normalizeResponseMode("detailed"),
    language
  );
  const fallback = deterministicTurn(contractName, accountType, language, conversation, shouldFinish);
  const output = await completeGemini({
    system,
    prompt: `Conversation:\n${conversation.map((message) => `${message.role}: ${message.content}`).join("\n")}\n\nThe target information threshold has ${shouldFinish ? "" : "not "}been reached.`,
    maxTokens: shouldFinish ? 6000 : 1800,
    json: true
  });
  if (!output) return fallback;
  try {
    const parsed = JSON.parse(output.replace(/^```json\s*|\s*```$/g, ""));
    return {
      isComplete: Boolean(parsed.isComplete),
      nextQuestion: String(parsed.nextQuestion || fallback.nextQuestion),
      draft: String(parsed.draft || "")
    };
  } catch {
    return fallback;
  }
}

function firstQuestionFor(name: string, accountType: string, language: AILanguage) {
  if (language === "ru") {
    return accountType === "lawyer"
      ? `Укажите стороны и представляемую сторону для документа «${name}».`
      : `Кто будет сторонами этого договора? Напишите имена или названия.`;
  }
  return accountType === "lawyer"
    ? `Identify the parties and represented party for this ${name}.`
    : `Who will be the parties to this agreement? Names or business names are enough.`;
}

function deterministicTurn(
  name: string,
  accountType: string,
  language: AILanguage,
  conversation: Message[],
  shouldFinish: boolean
) {
  const answers = conversation.filter((message) => message.role === "user").map((message) => message.content);
  const questionsRu = ["Что именно стороны договариваются сделать?", "Какая сумма, порядок и срок оплаты?", "Когда договор начинает и прекращает действовать?", "Что должно произойти при нарушении или досрочном отказе?", "Право какой страны или города должно применяться?"];
  const questionsEn = ["What exactly will each party do?", "What amount, payment method, and payment deadline should apply?", "When should the agreement start and end?", "What should happen after a breach or early cancellation?", "Which country or state law should govern?"];
  if (!shouldFinish) {
    const questions = language === "ru" ? questionsRu : questionsEn;
    return { isComplete: false, nextQuestion: questions[Math.min(answers.length - 1, questions.length - 1)], draft: "" };
  }
  const title = language === "ru" ? name : name;
  const draft = language === "ru"
    ? `# ${title}\n\n## 1. Стороны\n${answers[0] || "[СТОРОНЫ]"}\n\n## 2. Предмет договора\n${answers[1] || "[ПРЕДМЕТ]"}\n\n## 3. Оплата\n${answers[2] || "[УСЛОВИЯ ОПЛАТЫ]"}\n\n## 4. Срок действия\n${answers[3] || "[СРОК]"}\n\n## 5. Нарушение и расторжение\n${answers[4] || "[ПОСЛЕДСТВИЯ НАРУШЕНИЯ]"}\n\n## 6. Применимое право\n${answers[5] || "[ПРИМЕНИМОЕ ПРАВО]"}\n\n## 7. Подписи\n[ПОДПИСЬ СТОРОНЫ 1]\n\n[ПОДПИСЬ СТОРОНЫ 2]\n\n⚠️ Документ создан с помощью AI. При существенных суммах или рисках рекомендуется проверка юристом до подписания.`
    : `# ${title}\n\n## 1. Parties\n${answers[0] || "[PARTIES]"}\n\n## 2. Purpose\n${answers[1] || "[SUBJECT MATTER]"}\n\n## 3. Payment\n${answers[2] || "[PAYMENT TERMS]"}\n\n## 4. Term\n${answers[3] || "[TERM]"}\n\n## 5. Breach and Termination\n${answers[4] || "[BREACH CONSEQUENCES]"}\n\n## 6. Governing Law\n${answers[5] || "[GOVERNING LAW]"}\n\n## 7. Signatures\n[PARTY 1 SIGNATURE]\n\n[PARTY 2 SIGNATURE]\n\n⚠️ This document was created by AI. For significant money or risk, consider having a lawyer review it before signing.`;
  return { isComplete: true, nextQuestion: "", draft };
}
