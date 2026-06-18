import { createToolHandler } from "@/lib/stream-tool";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";
export const POST = createToolHandler(TOOL_PROMPTS.research);
