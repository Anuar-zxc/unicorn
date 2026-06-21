import { createToolHandler } from "@/lib/stream-tool";
import { SELLER_TAX_PROMPT } from "@/lib/ai-prompts";
import {
  getTrustedLegalContext
} from "@/lib/legal-sources";

export async function POST(req: Request) {
  const body = await req.json();
  const input = `Platform: ${body.platform}
Monthly revenue: ${body.revenueRange}
Registered as ИП: ${body.isRegisteredIP}
Products or services: ${body.productType}`;

  const handler = createToolHandler(SELLER_TAX_PROMPT, {
    toolType: "seller-tax",
    systemAddon: async (question) =>
      getTrustedLegalContext(question, "Kazakhstan")
  });

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
