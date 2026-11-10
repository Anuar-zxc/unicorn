"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  DocumentInputError,
  extractDocumentForAnalysis,
  MAX_UPLOAD_BYTES,
  type ExtractedDocument
} from "@/lib/file-text";
import { completeGemini } from "@/lib/gemini";
import { canAnalyze } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countMonthlyUsage, recordUsageEvent } from "@/lib/usage-server";

/** Long contracts: ~60–80 pages of text fit comfortably in Gemini's context. */
const MAX_ANALYSIS_CHARS = 240_000;

const messages = {
  en: {
    noFile: "Upload a PDF, DOCX, or legal image first.",
    badType: "Only PDF, DOCX, JPG, PNG, WEBP, HEIC, and HEIF files are supported.",
    tooLarge: "File must be smaller than 10 MB.",
    signIn: "Please log in before analyzing a contract.",
    limit: "You reached your monthly analysis limit. Upgrade your plan to continue.",
    unreadable: "Could not read this document. Try another PDF, DOCX, or image.",
    tooShort: "We could not extract enough text. If this is a scan, upload it as a photo (JPG/PNG) so Lexo can read it with OCR.",
    aiFailed: "The AI model is busy right now. Your quota was not used — please try again in a minute.",
    saveFailed: "The analysis finished but could not be saved. Please try again."
  },
  ru: {
    noFile: "Сначала загрузите PDF, DOCX или фото документа.",
    badType: "Поддерживаются только PDF, DOCX, JPG, PNG, WEBP, HEIC и HEIF.",
    tooLarge: "Файл должен быть меньше 10 МБ.",
    signIn: "Войдите в аккаунт, чтобы проверить договор.",
    limit: "Месячный лимит проверок исчерпан. Обновите тариф, чтобы продолжить.",
    unreadable: "Не удалось прочитать документ. Попробуйте другой PDF, DOCX или фото.",
    tooShort: "Не удалось извлечь текст. Если это скан, загрузите его как фото (JPG/PNG) — Lexo распознает текст.",
    aiFailed: "AI-модель сейчас перегружена. Лимит не списан — попробуйте ещё раз через минуту.",
    saveFailed: "Анализ готов, но не сохранился. Попробуйте ещё раз."
  }
};
import {
  buildSystemPrompt,
  normalizeResponseMode,
  type ResponseMode
} from "@/lib/ai-prompts";
import {
  normalizeAILanguage,
  type AILanguage
} from "@/lib/ai-language";

const resultSchema = z.object({
  summary: z.string(),
  overallRisk: z.enum(["High", "Medium", "Low"]).optional(),
  jurisdiction: z.string().optional(),
  importantClauses: z.array(z.string()),
  risks: z.array(
    z.object({
      level: z.enum(["High", "Medium", "Low"]),
      title: z.string(),
      explanation: z.string(),
      recommendation: z.string(),
      clauseText: z.string().optional(),
      replacementLanguage: z.string().optional()
    })
  ),
  lawyerQuestions: z.array(z.string()),
  disclaimer: z.string()
});

export type AnalysisResult = z.infer<typeof resultSchema>;

export type AnalyzeState = {
  ok: boolean;
  error?: string;
  analysisId?: string;
};

const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
];

const acceptedExtensions = /\.(pdf|docx|jpe?g|png|webp|heic|heif)$/i;

export async function analyzeContractAction(
  _prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const file = formData.get("contract");
  const mode = normalizeResponseMode(formData.get("mode"));
  const requestedLanguage = formData.get("language");
  const text = messages[normalizeAILanguage(requestedLanguage)];
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: text.noFile };
  }

  const isAccepted =
    acceptedTypes.includes(file.type) ||
    acceptedExtensions.test(file.name);

  if (!isAccepted) {
    return { ok: false, error: text.badType };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: text.tooLarge };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: text.signIn };
  }

  const [{ data: profile }, used] = await Promise.all([
    supabase.from("profiles").select("plan,ai_language").eq("id", user.id).maybeSingle(),
    countMonthlyUsage(supabase, user.id, "analyses")
  ]);

  if (!canAnalyze(profile?.plan, used)) {
    return { ok: false, error: text.limit };
  }

  let document: ExtractedDocument;
  try {
    document = await extractDocumentForAnalysis(file);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof DocumentInputError ? error.message : text.unreadable
    };
  }

  if (document.kind === "text" && document.text.trim().length < 100) {
    return { ok: false, error: text.tooShort };
  }

  const language = normalizeAILanguage(
    requestedLanguage ?? profile?.ai_language
  );

  // Run the AI first: if it fails, nothing is uploaded and no quota is used.
  let analysis: AnalysisResult;
  try {
    analysis = await runAnalysis(document, mode, language);
  } catch (error) {
    console.error("[analyze] AI analysis failed", error);
    return { ok: false, error: messages[language].aiFailed };
  }

  const safeName = file.name.replace(/[^\p{L}\p{N}._-]+/gu, "_").slice(-120) || "document";
  const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });
  if (uploadError) console.error("[analyze] storage upload failed", uploadError.message);

  const extractedText =
    document.kind === "text"
      ? document.text
      : `[Image/scan uploaded for vision analysis: ${document.fileName} (${document.mimeType})]`;

  const { data, error: insertError } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      type: "review",
      tool_type: "review",
      title: file.name,
      file_name: file.name,
      file_path: uploadError ? null : filePath,
      extracted_text: extractedText.slice(0, MAX_ANALYSIS_CHARS),
      result: analysis
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[analyze] insert failed", insertError.message);
    return { ok: false, error: messages[language].saveFailed };
  }
  await recordUsageEvent(supabase, user.id, "review");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  return { ok: true, analysisId: data.id };
}

async function runAnalysis(
  document: ExtractedDocument,
  mode: ResponseMode,
  language: AILanguage
): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    if (language === "ru") {
      return {
        summary: "AI-модель временно недоступна. Lexo сохранил документ, но для полноценного анализа необходимо повторить запрос после восстановления подключения.",
        overallRisk: "Medium",
        jurisdiction: "Не определена",
        importantClauses: ["Оплата и сроки", "Расторжение", "Ответственность и возмещение убытков"],
        risks: [{
          level: "Medium",
          title: "Требуется живая проверка",
          explanation: "Резервный режим не должен использоваться как окончательный юридический вывод.",
          recommendation: "Повторите анализ и проверьте документ с юристом."
        }],
        lawyerQuestions: ["Какие условия создают наибольший финансовый риск?", "Соответствует ли договор применимому праву?"],
        disclaimer: "Документ проанализирован с помощью AI. Перед подписанием рекомендуется проверка юристом."
      };
    }
    return {
      summary:
        "Gemini API is not configured yet, so Lexo is showing an investor-demo analysis. Once GEMINI_API_KEY is added, Lexo will read PDF, DOCX, scans, and legal photos live.",
      overallRisk: "Medium",
      jurisdiction: "California law appears likely, but this must be confirmed from the governing law clause.",
      importantClauses: [
        "Payment and late-fee obligations",
        "Automatic renewal or cancellation windows",
        "Liability limits and indemnity language"
      ],
      risks: [
        {
          level: "High",
          title: "Automatic renewal clause",
          explanation:
            "The contract may renew without a fresh approval if you miss the cancellation window.",
          recommendation:
            "Ask for a reminder period or the right to cancel before renewal.",
          clauseText: "This Agreement shall automatically renew for successive twelve-month terms unless either party gives written notice at least sixty days before renewal.",
          replacementLanguage: "This Agreement may renew only with written confirmation from both parties at least 30 days before the end of the then-current term."
        },
        {
          level: "Medium",
          title: "Broad liability language",
          explanation:
            "You may be responsible for more damages than expected if something goes wrong.",
          recommendation:
            "Request a reasonable liability cap tied to fees paid.",
          clauseText: "Customer shall indemnify vendor from all claims, damages, losses, and expenses arising from or related to this Agreement.",
          replacementLanguage: "Each party's liability shall not exceed the fees paid in the three months before the claim, except for fraud, willful misconduct, or confidentiality breaches."
        }
      ],
      lawyerQuestions: [
        "Is the liability cap reasonable for my business?",
        "Can the renewal and termination language be narrowed?"
      ],
      disclaimer:
        "Professional AI analysis — attorney review recommended before client delivery."
    };
  }

  const content = await completeGemini({
    system: buildSystemPrompt(`You are Lexo's contract analysis AI. The reader is about to sign this document and needs to know what could cost them money, rights, or time.

Analyse from the perspective of the person who uploaded it. Check: subject and essential terms, price and payment, term and auto-renewal, termination and notice periods, penalties (неустойка/штрафы) and liability caps, indemnities, deposits, dispute resolution and governing law, intellectual property, confidentiality, personal data, and any essential terms that are missing.
If the document is governed by Kazakhstan law (or is in Russian/Kazakh without another governing law), apply Kazakhstan civil-law concepts and cite the Civil Code or other acts of the Republic of Kazakhstan only when you are confident of the article; otherwise describe the rule without a number.
Quote clause text exactly as it appears. Never invent clauses that are not in the document.

Return JSON with these keys:
summary: string, 2-4 sentences — what the document is, who the parties are, and the overall verdict.
overallRisk: "High" | "Medium" | "Low".
jurisdiction: detected governing law or "Not detected" (translated).
importantClauses: string[] — the clauses the reader must understand, each one line.
risks: array ordered from highest to lowest risk, each object with level High/Medium/Low, title, explanation (plain language, why it matters in money/time/rights), recommendation (what to ask for), clauseText (exact quote, if any), replacementLanguage (ready-to-send wording).
lawyerQuestions: string[] — 3-5 concrete questions for a lawyer.
disclaimer: string.

Use simple language. Never pretend to be a licensed lawyer. Always include a disclaimer that this is informational only.
Return only valid JSON. Translate all human-readable JSON values into the selected output language, but keep risk enum values exactly High, Medium, or Low. Do not wrap the JSON in markdown fences.`, mode, language),
    prompt:
      document.kind === "image"
        ? "Read this legal image/scan/photo. First perform OCR, then analyze the legal document."
        : `Analyze this contract text:\n\n${document.text.slice(0, MAX_ANALYSIS_CHARS)}${document.text.length > MAX_ANALYSIS_CHARS ? "\n\n[Document truncated. Mention in the summary that only the first part was analysed.]" : ""}`,
    inlineDocument:
      document.kind === "image"
        ? { mimeType: document.mimeType, dataUrl: document.dataUrl }
        : undefined,
    maxTokens: 8000,
    json: true
  });

  if (!content) throw new Error("Empty AI response.");
  const parsed = resultSchema.safeParse(JSON.parse(stripJsonFences(content)));
  if (!parsed.success) {
    throw new Error("AI returned an invalid analysis format.");
  }
  return parsed.data;
}

function stripJsonFences(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}

export async function deleteAnalysisAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !id) return;

  await supabase.from("analyses").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/history");
}
