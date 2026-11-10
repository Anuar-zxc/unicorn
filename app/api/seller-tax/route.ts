import { createToolHandler } from "@/lib/stream-tool";
import { SELLER_TAX_PROMPT } from "@/lib/ai-prompts";
import { getTrustedLegalContext } from "@/lib/legal-sources";

export const maxDuration = 60;

const handler = createToolHandler(SELLER_TAX_PROMPT, {
  feature: "questions",
  toolType: "seller-tax",
  systemAddon: async (question) => getTrustedLegalContext(question, "Kazakhstan")
});

function field(value: unknown, max = 300) {
  return typeof value === "string" || typeof value === "boolean" || typeof value === "number"
    ? String(value).slice(0, max)
    : "not specified";
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const input = `Platform: ${field(body.platform)}
Monthly revenue: ${field(body.revenueRange)}
Registered as ИП: ${field(body.isRegisteredIP)}
Products or services: ${field(body.productType, 1000)}`;

  return handler(
    new Request(req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        context: "Kazakhstan marketplace seller taxation",
        mode: body.mode,
        language: body.language
      })
    })
  );
}
