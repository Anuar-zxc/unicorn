import { createToolHandler } from "@/lib/stream-tool";
import { PERSONAL_LEGAL_PROMPT } from "@/lib/ai-prompts";
import { getTrustedLegalContext } from "@/lib/legal-sources";

export const maxDuration = 60;

export const POST = createToolHandler(PERSONAL_LEGAL_PROMPT, {
  feature: "questions",
  toolType: "ask",
  systemAddon: getTrustedLegalContext
});
