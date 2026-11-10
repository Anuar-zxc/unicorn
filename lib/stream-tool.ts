import {
  DocumentInputError,
  extractDocumentForAnalysis
} from "@/lib/file-text";
import { streamGemini } from "@/lib/gemini";
import { authorizeFeature, recordToolUsage, recordUsageEvent } from "@/lib/usage-server";
import type { UsageFeature } from "@/lib/usage";
import {
  buildSystemPrompt,
  normalizeResponseMode,
  type ResponseMode
} from "@/lib/ai-prompts";
import { normalizeAILanguage, type AILanguage } from "@/lib/ai-language";

/** ~60–80 pages of contract text; Gemini Flash-Lite handles this comfortably. */
export const MAX_INPUT_CHARS = 240_000;
const MAX_CONTEXT_CHARS = 2_000;
const MAX_FILES = 2;

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

const interruptedNote = {
  en: "\n\n---\n_The AI connection was interrupted. The answer above may be incomplete — please run it again._",
  ru: "\n\n---\n_Связь с AI прервалась. Ответ выше может быть неполным — запустите анализ ещё раз._"
};

type LocalEngine = (
  input: string,
  context: string,
  mode: ResponseMode,
  language: AILanguage
) => Promise<ReadableStream<Uint8Array>>;

type ParsedRequest = {
  input: string;
  context: string;
  mode: unknown;
  language: unknown;
  images: { mimeType: string; dataUrl: string }[];
};

async function parseRequest(req: Request): Promise<ParsedRequest> {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const data = await req.formData();
    const files = data
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);
    if (files.length > MAX_FILES) {
      throw new DocumentInputError(`Upload at most ${MAX_FILES} files at a time.`);
    }
    const images: ParsedRequest["images"] = [];
    const documents = await Promise.all(
      files.map(async (file, index) => {
        const document = await extractDocumentForAnalysis(file);
        if (document.kind === "image") {
          images.push({ mimeType: document.mimeType, dataUrl: document.dataUrl });
          return `\n\n--- DOCUMENT ${index + 1}: ${file.name} ---\n[Image or scan attached — read it with OCR before analysing.]`;
        }
        return `\n\n--- DOCUMENT ${index + 1}: ${file.name} ---\n${document.text}`;
      })
    );
    return {
      input: `${String(data.get("input") ?? "")}${documents.join("")}`,
      context: String(data.get("context") ?? ""),
      mode: data.get("mode"),
      language: data.get("language"),
      images
    };
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  return {
    input: [body.input, body.secondaryInput]
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .join("\n\n--- SECOND VERSION / ADDITIONAL MATERIAL ---\n"),
    context: typeof body.context === "string" ? body.context : "",
    mode: body.mode,
    language: body.language,
    images: []
  };
}

export function createToolHandler(
  systemPrompt: string,
  options: {
    feature?: UsageFeature;
    toolType?: string;
    systemAddon?: (input: string, context: string) => Promise<string>;
    /** Optional self-hosted engine (e.g. Ollama). Used only when OLLAMA_BASE_URL is set. */
    localEngine?: LocalEngine;
  } = {}
) {
  const toolType = options.toolType ?? "build";

  return async function POST(req: Request) {
    const access = await authorizeFeature(options.feature ?? "builds");
    if (!access.ok) {
      return new Response(access.message, { status: access.status });
    }

    let parsed: ParsedRequest;
    try {
      parsed = await parseRequest(req);
    } catch (error) {
      const message =
        error instanceof DocumentInputError ? error.message : "Could not read the request.";
      return new Response(message, { status: 400 });
    }

    const input = parsed.input.trim();
    const context = parsed.context.slice(0, MAX_CONTEXT_CHARS);
    if (!input && parsed.images.length === 0) {
      return new Response("Input is required.", { status: 400 });
    }

    const mode = normalizeResponseMode(parsed.mode);
    const language = normalizeAILanguage(parsed.language ?? access.profile?.ai_language);

    if (options.localEngine && process.env.OLLAMA_BASE_URL) {
      try {
        const stream = await options.localEngine(input, context, mode, language);
        await recordUsageEvent(access.supabase, access.user.id, toolType);
        return new Response(stream, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Lexo-Engine": "local"
          }
        });
      } catch (error) {
        console.warn("Local engine failed, falling back to Gemini", error);
      }
    }

    const addon = options.systemAddon
      ? await options.systemAddon(input, context).catch(() => "")
      : "";
    const system = `${buildSystemPrompt(systemPrompt, mode, language)}\n\nWorkspace context: ${
      context || "No additional context supplied."
    }${addon ? `\n\n${addon}` : ""}`;
    const truncated = input.length > MAX_INPUT_CHARS;
    const prompt = truncated
      ? `${input.slice(0, MAX_INPUT_CHARS)}\n\n[Material truncated at ${MAX_INPUT_CHARS} characters. Mention this limitation in the answer.]`
      : input;

    return streamCompletion({
      system,
      prompt,
      images: parsed.images,
      maxTokens: mode === "detailed" ? 8000 : 3000,
      fallbackText: fallback[language],
      language,
      logLabel: toolType,
      onComplete: (output) =>
        recordToolUsage({
          supabase: access.supabase,
          userId: access.user.id,
          toolType,
          input: `${input}\n\nContext: ${context}`,
          output
        })
    });
  };
}

/**
 * Streams a Gemini answer to the client as it is generated.
 * - Falls back to `fallbackText` if the model is unavailable.
 * - Calls `onComplete` only when the model actually answered, so a canned
 *   fallback never burns the user's monthly quota.
 */
export function streamCompletion({
  system,
  prompt,
  images = [],
  maxTokens,
  fallbackText,
  language,
  logLabel,
  onComplete
}: {
  system: string;
  prompt: string;
  images?: { mimeType: string; dataUrl: string }[];
  maxTokens: number;
  fallbackText: string;
  language: AILanguage;
  logLabel: string;
  onComplete?: (output: string) => Promise<void>;
}) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let output = "";
      let modelAnswered = false;
      try {
        for await (const chunk of streamGemini({
          system,
          prompt,
          inlineDocuments: images,
          maxTokens
        })) {
          modelAnswered = true;
          output += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        console.error(`[${logLabel}] Gemini failed`, error);
        if (output) {
          output += interruptedNote[language];
          controller.enqueue(encoder.encode(interruptedNote[language]));
        }
      }
      if (!output) {
        output = fallbackText;
        controller.enqueue(encoder.encode(output));
      }
      if (modelAnswered && onComplete) {
        try {
          await onComplete(output);
        } catch (error) {
          console.error(`[${logLabel}] usage record failed`, error);
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no"
    }
  });
}

/** Trims and caps a free-text field coming from the client. */
export function clampText(value: unknown, max = 8_000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
