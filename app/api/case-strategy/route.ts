import { STRATEGIST_SYSTEM } from "@/lib/ai-system";
import { completeGemini } from "@/lib/gemini";
import { authorizeFeature, recordToolUsage } from "@/lib/usage-server";
import { buildSystemPrompt, normalizeResponseMode } from "@/lib/ai-prompts";
import { normalizeAILanguage } from "@/lib/ai-language";

const demoStrategy = `# Case Strategy Brief

## 1. Case Summary
You described a situation where the other side appears to be holding money or performance after a clear obligation was created. Your position looks **MODERATE to STRONG** if you can prove the agreement, your performance, the other side's breach, and the amount owed.

Key facts that matter legally:
- What the contract or written promise says
- Whether you performed your obligations
- Whether the other side gave a reason for non-payment or non-performance
- Written evidence: invoices, emails, messages, notices, and payment history

## 2. Legal Framework
Most contract disputes turn on offer, acceptance, consideration, performance, breach, and damages. If this is in California, Civil Code §3300 generally allows damages that naturally arise from a breach of contract. If this is a landlord deposit dispute, California Civil Code §1950.5 may apply and can create strict deadlines.

## 3. Your Strongest Arguments
1. **Clear agreement existed**
   - Legal basis: contract formation principles
   - Evidence needed: signed contract, email acceptance, invoice approval, payment records
   - Strength: ●●●●○

2. **You performed your side**
   - Legal basis: breach requires showing you did what was required or were excused
   - Evidence needed: delivery records, milestones, screenshots, correspondence
   - Strength: ●●●○○

3. **The other side caused measurable loss**
   - Legal basis: damages must be provable
   - Evidence needed: unpaid invoices, repair costs, replacement quotes, bank records
   - Strength: ●●●○○

## 4. Risks & Counter-arguments
They may claim the work was incomplete, late, or defective. Your response should be organized around objective proof: delivery dates, acceptance messages, prior payments, and any written approvals.

They may also claim there was no binding agreement. Your response is strongest if you have signed terms, an email thread confirming scope, or conduct showing both sides accepted the deal.

## 5. Recommended Strategy
Week 1:
- Put every document into a timeline
- Send a short evidence-preservation email
- Prepare a formal demand letter with a clear deadline

Week 2:
- If no response, escalate with a final notice
- Prepare a concise lawyer packet with facts, evidence, legal issues, and desired outcome

## 6. Demand Letter Template
[YOUR NAME]
[ADDRESS]
[DATE]

Re: Demand for resolution of [DISPUTE]

Dear [RECIPIENT],

I am writing to request resolution of the dispute involving [SHORT DESCRIPTION]. Based on our agreement dated [DATE], you were required to [OBLIGATION]. I performed my obligations by [FACTS], but you have not [BREACH].

Please resolve this matter by [DATE]. If I do not receive a response, I will consider further options, including consulting counsel and pursuing available remedies.

Sincerely,
[YOUR NAME]

## 7. Questions for Your Lawyer
- Which statute of limitations applies in this jurisdiction?
- Is a demand letter required or strategically useful before filing?
- Are attorney's fees recoverable under the contract or local law?
- What evidence would make the claim stronger before negotiation?
- Is small claims court appropriate for the amount at issue?

Professional AI analysis — attorney review recommended before client delivery.`;

function streamText(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,90}(\s|$)/g) ?? [text]) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 18));
      }
      controller.close();
    }
  });
}

export async function POST(req: Request) {
  const access = await authorizeFeature("caseStrategies");
  if (!access.ok) {
    return new Response(access.message, { status: access.status });
  }

  const { situation, outcome, stage, jurisdiction, documentsSummary, followups, mode, language } = await req.json();
  const systemPrompt = buildSystemPrompt(`${STRATEGIST_SYSTEM}

Your analysis must include:
1. CASE SUMMARY
2. LEGAL FRAMEWORK with specific laws and statutes where possible
3. STRONGEST ARGUMENTS, strongest first, with legal basis
4. RISKS and counter-arguments
5. RECOMMENDED STRATEGY
6. DEMAND LETTER if applicable
7. LAWYER QUESTIONS

Rules:
- Cite real, specific laws when you are confident
- Acknowledge uncertainty where it exists
- Be strategic, practical, and organized
- Format as clean markdown with clear section headers

Jurisdiction: ${jurisdiction || "Not provided"}`, normalizeResponseMode(mode), normalizeAILanguage(language ?? access.profile?.ai_language));

  const output = await completeGemini({
    system: systemPrompt,
    prompt: `Situation: ${situation}
Desired outcome: ${outcome}
Stage: ${stage}
Documents summary: ${documentsSummary || "No documents uploaded"}
Follow-up answers: ${followups || "None"}`,
    maxTokens: 7000
  });
  const responseLanguage = normalizeAILanguage(language ?? access.profile?.ai_language);
  const result = output || (responseLanguage === "ru" ? `# Стратегия по делу

## Краткое резюме
Соберите договоры, переписку, платежи, уведомления и хронологию событий.

## Правовые вопросы
- Было ли создано обязательство?
- Исполнили ли вы свою часть?
- Какой ущерб можно подтвердить документами?

## Следующие шаги
1. Составьте хронологию.
2. Сохраните доказательства.
3. Подготовьте письменную претензию.
4. Уточните применимое право и срок исковой давности с юристом.

Анализ создан с помощью AI — рекомендуется профессиональная проверка.` : demoStrategy);
  await recordToolUsage({
    supabase: access.supabase,
    userId: access.user.id,
    toolType: "case",
    input: `${situation}\n${outcome}\n${stage}\n${jurisdiction}\n${documentsSummary ?? ""}`,
    output: result
  });

  return new Response(streamText(result), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
