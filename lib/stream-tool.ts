import { extractContractText } from "@/lib/file-text";
import { streamDeepSeek } from "@/lib/deepseek";

const fallback = `## Professional AI analysis

The workspace is waiting for the DeepSeek API key.

Add \`DEEPSEEK_API_KEY\` to the deployment environment to stream a complete attorney-ready result. The submitted material will then be processed with the selected tool prompt.

## Attorney review

AI-assisted analysis — attorney review recommended before client delivery.`;

export function createToolHandler(systemPrompt: string) {
  return async function POST(req: Request) {
    try {
      const contentType = req.headers.get("content-type") ?? "";
      let input = "";
      let context = "";
      if (contentType.includes("multipart/form-data")) {
        const data = await req.formData();
        context = String(data.get("context") ?? "");
        const files = data.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
        const texts = await Promise.all(files.map(async (file, index) => `\n\n--- DOCUMENT ${index + 1}: ${file.name} ---\n${await extractContractText(file)}`));
        input = `${String(data.get("input") ?? "")}${texts.join("")}`;
      } else {
        const body = await req.json();
        input = [body.input, body.secondaryInput].filter(Boolean).join("\n\n--- SECOND VERSION / ADDITIONAL MATERIAL ---\n");
        context = body.context ?? "";
      }
      if (!input.trim()) return new Response("Input is required.", { status: 400 });
      const stream = await streamDeepSeek({
        system: `${systemPrompt}\n\nWorkspace context: ${context || "No additional context supplied."}`,
        user: input.slice(0, 30000),
        maxTokens: 5000
      });
      if (!stream) return new Response(streamFallback(fallback), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
      return new Response(stream, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "no-store" } });
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
