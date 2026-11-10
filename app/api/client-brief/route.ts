import { createToolHandler } from "@/lib/stream-tool";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";

export const maxDuration = 60;
export const POST = createToolHandler(TOOL_PROMPTS.client, { toolType: "client" });
