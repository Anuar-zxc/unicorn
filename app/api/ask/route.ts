import { createToolHandler } from "@/lib/stream-tool";
import { PERSONAL_LEGAL_PROMPT } from "@/lib/ai-prompts";
import {
  getTrustedLegalContext
} from "@/lib/legal-sources";

export const POST = createToolHandler(PERSONAL_LEGAL_PROMPT, {
  toolType: "ask",
  systemAddon: getTrustedLegalContext
});
