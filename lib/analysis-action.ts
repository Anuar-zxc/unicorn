"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CLAUDE_ANALYSIS_MODEL, getAnthropicClient } from "@/lib/anthropic";
import { extractContractText } from "@/lib/file-text";
import { canAnalyze } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export async function analyzeContractAction(
  _prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const file = formData.get("contract");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Upload a PDF or DOCX contract first." };
  }

  const isAccepted =
    acceptedTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".pdf") ||
    file.name.toLowerCase().endsWith(".docx");

  if (!isAccepted) {
    return { ok: false, error: "Only PDF and DOCX files are supported." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: "File must be smaller than 10MB." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please log in before analyzing a contract." };
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const { count } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());

  if (!canAnalyze(profile?.plan, count ?? 0)) {
    return {
      ok: false,
      error: "You used your free monthly analysis. Upgrade to Pro for unlimited analyses."
    };
  }

  let extractedText = "";
  try {
    extractedText = await extractContractText(file);
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not read this document. Try another PDF or DOCX."
    };
  }

  if (extractedText.trim().length < 100) {
    return {
      ok: false,
      error: "We could not extract enough text from this contract."
    };
  }

  const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const analysis = await runAnalysis(extractedText.slice(0, 80_000));

  const { data, error: insertError } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      extracted_text: extractedText,
      result: analysis
    })
    .select("id")
    .single();

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  return { ok: true, analysisId: data.id };
}

async function runAnalysis(text: string): Promise<AnalysisResult> {
  const client = getAnthropicClient();

  if (!client) {
    return {
      summary:
        "This is a demo analysis because ANTHROPIC_API_KEY is not configured. The contract should be reviewed for obligations, renewal terms, payment duties, and termination rules.",
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
        "This analysis is informational only and is not legal advice. Consult a licensed lawyer before signing."
    };
  }

  const response = await client.messages.create({
    model: CLAUDE_ANALYSIS_MODEL,
    max_tokens: 3000,
    temperature: 0.2,
    system: `You are a professional contract analyst.

Analyze this document and return JSON with these keys:
summary: string, 2-3 sentences.
overallRisk: "High" | "Medium" | "Low".
jurisdiction: detected governing law or "Not detected".
importantClauses: string[].
risks: array of objects with level High/Medium/Low, title, explanation, recommendation, clauseText, replacementLanguage.
lawyerQuestions: string[].
disclaimer: string.

Use simple language. Never pretend to be a licensed lawyer. Always include a disclaimer that this is informational only.
Return only valid JSON. Do not wrap the JSON in markdown fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this contract text:\n\n${text}`
      }
    ]
  });

  const content = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
  const parsed = resultSchema.safeParse(JSON.parse(content ?? "{}"));
  if (!parsed.success) {
    throw new Error("AI returned an invalid analysis format.");
  }
  return parsed.data;
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
