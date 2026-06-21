import { extractDocumentForAnalysis } from "@/lib/file-text";
import { completeGemini } from "@/lib/gemini";
import { authorizeFeature, recordToolUsage } from "@/lib/usage-server";
import type { UsageFeature } from "@/lib/usage";
import {
  buildSystemPrompt,
  normalizeResponseMode
} from "@/lib/ai-prompts";
import { normalizeAILanguage } from "@/lib/ai-language";

const fallback = {
  en: `## Professional AI analysis

Lexo could not reach the live AI model, so this is a structured fallback.

## Key observations
- Confirm the user's goal, jurisdiction, and represented party.
- Extract facts, deadlines, obligations, and risks.
- Verify every legal citation before relying on it.

## Recommended next steps
Review the source material and retry the live analysis.

AI-assisted analysis — professional review recommended.`,
  ru: `## Профессиональный AI-анализ

Lexo не смог подключиться к AI-модели, поэтому показан структурированный резервный ответ.

## Ключевые наблюдения
- Уточните цель, юрисдикцию и представляемую сторону.
- Выделите факты, сроки, обязательства и риски.
- Перепроверьте каждую правовую ссылку.

## Следующие шаги
Проверьте исходные материалы и повторите анализ.

Анализ создан с помощью AI — рекомендуется проверка специалистом.`
};

export function createToolHandler(
  systemPrompt: string,
  options: {
    feature?: UsageFeature;
    toolType?: string;
    systemAddon?: (input: string, context: string) => Promise<string>;
  } = {}
) {
  return async function POST(req: Request) {
    try {
      const access = await authorizeFeature(options.feature ?? "builds");
      if (!access.ok) {
        return new Response(access.message, { status: access.status });
      }

      const contentType = req.headers.get("content-type") ?? "";
      let input = "";
      let context = "";
      let mode: unknown = "concise";
      let language: unknown;
      if (contentType.includes("multipart/form-data")) {
        const data = await req.formData();
        context = String(data.get("context") ?? "");
        mode = data.get("mode");
        language = data.get("language");
        const files = data
          .getAll("files")
          .filter((item): item is File => item instanceof File && item.size > 0);
        const documents = await Promise.all(
          files.map(async (file, index) => {
            const document = await extractDocumentForAnalysis(file);
            if (document.kind === "image") {
              return `\n\n--- DOCUMENT ${index + 1}: ${file.name} ---\n[Image/scan uploaded. Vision analysis is available in Contract Review after GEMINI_API_KEY is configured.]`;
            }
            return `\n\n--- DOCUMENT ${index + 1}: ${file.name} ---\n${document.text}`;
          })
        );
        input = `${String(data.get("input") ?? "")}${documents.join("")}`;
      } else {
        const body = await req.json();
        input = [body.input, body.secondaryInput].filter(Boolean).join("\n\n--- SECOND VERSION / ADDITIONAL MATERIAL ---\n");
        context = body.context ?? "";
        mode = body.mode;
        language = body.language;
      }
      if (!input.trim()) return new Response("Input is required.", { status: 400 });
      const addon = options.systemAddon
        ? await options.systemAddon(input, context)
        : "";
      const responseLanguage = normalizeAILanguage(
        language ?? access.profile?.ai_language
      );
      const output = await completeGemini({
        system: `${buildSystemPrompt(
          systemPrompt,
          normalizeResponseMode(mode),
          responseLanguage
        )}\n\nWorkspace context: ${
          context || "No additional context supplied."
        }${addon ? `\n\n${addon}` : ""}`,
        prompt: input.slice(0, 30000),
        maxTokens: 5000
      });
      const result = output || fallback[responseLanguage];
      await recordToolUsage({
        supabase: access.supabase,
        userId: access.user.id,
        toolType: options.toolType ?? "build",
        input: `${input}\n\nContext: ${context}`,
        output: result
      });
      return new Response(streamFallback(result), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "no-store" } });
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Unable to process this request.", { status: 500 });
    }
  };
}

function streamFallback(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,80}(\s|$)/g) ?? [text]) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      controller.close();
    }
  });
}
