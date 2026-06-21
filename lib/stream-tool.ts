import { extractDocumentForAnalysis } from "@/lib/file-text";
import { completeGemini } from "@/lib/gemini";
import { authorizeFeature, recordToolUsage } from "@/lib/usage-server";
import type { UsageFeature } from "@/lib/usage";
import {
  buildSystemPrompt,
  normalizeResponseMode
} from "@/lib/ai-prompts";

const fallback = `## Professional AI analysis

Lexo is running in investor demo mode.

Add a free Google AI Studio \`GEMINI_API_KEY\` to enable live AI generation for documents, scans, and photos. For now, this preview shows the expected attorney-ready structure.

## Key observations
- Identify the client's goal and represented party.
- Extract important facts, deadlines, obligations, and risks.
- Convert the material into a practical legal work product.

## Recommended next steps
1. Upload or paste the source material.
2. Confirm jurisdiction and client position.
3. Review the AI output before client delivery.

## Attorney review

AI-assisted analysis — attorney review recommended before client delivery.`;

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
      if (contentType.includes("multipart/form-data")) {
        const data = await req.formData();
        context = String(data.get("context") ?? "");
        mode = data.get("mode");
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
      }
      if (!input.trim()) return new Response("Input is required.", { status: 400 });
      const addon = options.systemAddon
        ? await options.systemAddon(input, context)
        : "";
      const output = await completeGemini({
        system: `${buildSystemPrompt(
          systemPrompt,
          normalizeResponseMode(mode)
        )}\n\nWorkspace context: ${
          context || "No additional context supplied."
        }${addon ? `\n\n${addon}` : ""}`,
        prompt: input.slice(0, 30000),
        maxTokens: 5000
      });
      const result = output || fallback;
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
