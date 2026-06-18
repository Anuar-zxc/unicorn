import { createToolHandler } from "@/lib/stream-tool";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";
import { streamLocalLegalAnswer } from "@/lib/kz-rag";

const cloudHandler = createToolHandler(TOOL_PROMPTS.research);

export async function POST(req: Request) {
  const body = await req.clone().json();
  try {
    const stream = await streamLocalLegalAnswer(body.input ?? "", body.context ?? "");
    return new Response(stream, { headers: { "Content-Type":"text/markdown; charset=utf-8", "X-Lexo-Engine":"local-kz-rag", "Cache-Control":"no-store" } });
  } catch {
    return cloudHandler(req);
  }
}
