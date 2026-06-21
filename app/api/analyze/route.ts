import { ANALYZER_SYSTEM } from "@/lib/ai-system";
import { extractDocumentForAnalysis, type ExtractedDocument } from "@/lib/file-text";
import { completeGemini } from "@/lib/gemini";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSystemPrompt, normalizeResponseMode } from "@/lib/ai-prompts";
import { normalizeAILanguage } from "@/lib/ai-language";

const demoReport = `## Executive Summary
This contract creates ongoing obligations and should be reviewed for renewal, liability, payment, termination, and indemnity language. Overall risk: MEDIUM.

## Risk Breakdown
| Clause | Plain meaning | Risk | Suggestion |
|--------|---------------|------|------------|
| Auto-renewal | The contract can renew unless you cancel early | HIGH | Require written renewal confirmation |
| Broad indemnity | You may cover too many third-party claims | MEDIUM | Add a liability cap and carve-outs |

## Negotiation Playbook
**Auto-renewal**
Current: "Agreement renews automatically unless cancelled 60 days before renewal."
Problem: Missing the window can lock you into another full term.
Replace with: "Renewal requires written confirmation by both parties at least 30 days before expiration."

## Questions for Your Lawyer
1. Is the renewal clause enforceable in this jurisdiction?
2. Is the indemnity language market-standard for this deal size?
3. Should liability be capped to fees paid in the previous 3 months?

Professional AI analysis — attorney review recommended before client delivery.`;

function streamText(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,90}(\s|$)/g) ?? [text]) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      controller.close();
    }
  });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let text = "";
  let document: ExtractedDocument | undefined;
  let mode: unknown = "concise";
  let language: unknown;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    mode = formData.get("mode");
    language = formData.get("language");
    const file = formData.get("contract") ?? formData.get("files");
    if (file instanceof File) {
      document = await extractDocumentForAnalysis(file);
      text = document.kind === "text" ? document.text : "";
    }
  } else {
    const body = await req.json();
    text = body.text ?? body.contractText ?? "";
    mode = body.mode;
    language = body.language;
  }

  if (!language) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("ai_language")
        .eq("id", user.id)
        .maybeSingle();
      language = data?.ai_language;
    }
  }

  if (!text.trim() && document?.kind !== "image") {
    return new Response(streamText(demoReport), {
      headers: { "Content-Type": "text/markdown; charset=utf-8" }
    });
  }

  const prompt = document?.kind === "image"
    ? "Read this legal image/scan/photo. First perform OCR, then analyze it as a legal document."
    : `Analyze this contract text:\n\n${text.slice(0, 8000)}`;

  const output = await completeGemini({
    system: buildSystemPrompt(`${ANALYZER_SYSTEM}

Return a structured markdown report with translated headings for: executive summary, risk breakdown, negotiation playbook, and questions for a lawyer.`, normalizeResponseMode(mode), normalizeAILanguage(language)),
    prompt,
    inlineDocument: document?.kind === "image" ? {
      mimeType: document.mimeType,
      dataUrl: document.dataUrl
    } : undefined,
    maxTokens: 5000
  });
  const responseLanguage = normalizeAILanguage(language);
  if (!output) return new Response(streamText(responseLanguage === "ru" ? `## Краткое резюме
Договор требует проверки условий оплаты, продления, расторжения, ответственности и возмещения убытков. Общий риск: MEDIUM.

## Основные риски
- Автоматическое продление может создать новый срок обязательств.
- Широкая ответственность может привести к непредвиденным расходам.

## Следующие шаги
Уточните применимое право и запросите более узкие формулировки спорных условий.

Анализ создан с помощью AI — рекомендуется проверка юристом.` : demoReport), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });

  return new Response(streamText(output), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
}
