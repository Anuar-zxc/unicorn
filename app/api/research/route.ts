import { createToolHandler } from "@/lib/stream-tool";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";
import { streamLocalLegalAnswer } from "@/lib/kz-rag";
import { getTrustedLegalContext } from "@/lib/legal-sources";

export const maxDuration = 60;

export const POST = createToolHandler(TOOL_PROMPTS.research, {
  toolType: "research",
  systemAddon: getTrustedLegalContext,
  localEngine: streamLocalLegalAnswer
});
