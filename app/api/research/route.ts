import { createToolHandler } from "@/lib/stream-tool";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";
import { streamLocalLegalAnswer } from "@/lib/kz-rag";
import {
  getTrustedLegalContext
} from "@/lib/legal-sources";
import { normalizeResponseMode } from "@/lib/ai-prompts";
import { normalizeAILanguage } from "@/lib/ai-language";

const cloudHandler = createToolHandler(TOOL_PROMPTS.research, {
  toolType: "research",
  systemAddon: getTrustedLegalContext
});

export async function POST(req: Request) {
  const body = await req.clone().json();
  try {
    const stream = await streamLocalLegalAnswer(
      body.input ?? "",
      body.context ?? "",
      normalizeResponseMode(body.mode),
      normalizeAILanguage(body.language)
    );
    return new Response(stream, { headers: { "Content-Type":"text/markdown; charset=utf-8", "X-Lexo-Engine":"local-kz-rag", "Cache-Control":"no-store" } });
  } catch {
    return cloudHandler(req);
  }
}
