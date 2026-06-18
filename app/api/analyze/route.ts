import { ANALYZER_SYSTEM } from "@/lib/ai-system";
import { extractContractText } from "@/lib/file-text";
import { streamDeepSeek } from "@/lib/deepseek";

const demoReport = `## Executive Summary
This contract creates ongoing obligations and should be reviewed for renewal, liability, payment, termination, and indemnity language. Overall risk: MEDIUM.

## Risk Breakdown
| Clause | Plain meaning | Risk | Suggestion |
|--------|---------------|------|------------|
| Auto-renewal | The contract can renew unless you cancel early | HIGH | Require written renewal confirmation |
| Broad indemnity | You may cover too many third-party claims | MEDIUM | Add a liability cap and carve-outs |

## Negotiation Playbook
**Auto-renewal**
Current: "Agreement renews automatically unless cancelled 60 days before renewal."
Problem: Missing the window can lock you into another full term.
Replace with: "Renewal requires written confirmation by both parties at least 30 days before expiration."

## Questions for Your Lawyer
1. Is the renewal clause enforceable in this jurisdiction?
2. Is the indemnity language market-standard for this deal size?
3. Should liability be capped to fees paid in the previous 3 months?

Professional AI analysis — attorney review recommended before client delivery.`;

function streamText(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,90}(\s|$)/g) ?? [text]) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      controller.close();
    }
  });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let text = "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("contract");
    if (file instanceof File) {
      text = await extractContractText(file);
    }
  } else {
    const body = await req.json();
    text = body.text ?? body.contractText ?? "";
  }

  if (!text.trim()) {
    return new Response(streamText(demoReport), {
      headers: { "Content-Type": "text/markdown; charset=utf-8" }
    });
  }

  const readable = await streamDeepSeek({
    system: `${ANALYZER_SYSTEM}

Return a structured markdown report with:
## Executive Summary
## Risk Breakdown
## Negotiation Playbook
## Questions for Your Lawyer`,
    user: text.slice(0, 8000),
    maxTokens: 5000
  });
  if (!readable) return new Response(streamText(demoReport), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
}
