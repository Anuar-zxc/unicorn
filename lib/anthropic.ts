import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_ANALYSIS_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
