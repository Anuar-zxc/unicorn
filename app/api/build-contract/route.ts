import { BUILDER_SYSTEM } from "@/lib/ai-system";
import { completeGemini } from "@/lib/gemini";

const demoContract = `# Mutual Non-Disclosure Agreement

## 1. Parties
This Mutual Non-Disclosure Agreement is entered into by [DISCLOSING PARTY NAME] and [RECEIVING PARTY NAME] as of [EFFECTIVE DATE].

## 2. Purpose
The parties wish to exchange confidential information for the purpose of evaluating a potential business relationship.

## 3. Confidential Information
Confidential Information includes technical, business, financial, customer, product, and operational information disclosed in writing, orally, visually, or electronically.

## 4. Obligations
Each party shall protect Confidential Information using at least reasonable care and shall not disclose it to third parties except to employees, contractors, or advisors who need to know and are bound by confidentiality duties.

## 5. Term
The confidentiality obligations continue for two years after disclosure unless a longer period is required for trade secrets under applicable law.

## 6. Governing Law
This Agreement is governed by the laws of [JURISDICTION].

## 7. Signatures
[PARTY A SIGNATURE]

[PARTY B SIGNATURE]

## AI Notes
- Assumption: this is a mutual NDA for a commercial relationship.
- A lawyer should review enforceability, trade secret language, and jurisdiction-specific restrictions.
- Add exact party names, dates, addresses, and permitted disclosure rules before signing.

Professional AI draft — attorney review recommended before client delivery.`;

function streamText(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of text.match(/.{1,80}(\s|$)/g) ?? [text]) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.close();
    }
  });
}

export async function POST(req: Request) {
  const { description, jurisdiction, clarifications } = await req.json();
  const systemPrompt = `${BUILDER_SYSTEM}

Draft professional, jurisdiction-aware legal contracts based on user descriptions.

Rules:
1. Use proper legal document structure: parties, recitals, definitions, obligations, governing law, signatures
2. Number all sections (1., 1.1, 1.2, etc.)
3. Use clear, enforceable language — not overly complex, not too simple
4. Always include: effective date placeholder, signature block, governing law clause
5. Add [BRACKETED PLACEHOLDERS] for info you don't have
6. After the contract, add "## AI Notes" with assumptions, lawyer review points, and jurisdiction warnings

Jurisdiction: ${jurisdiction || "United States (general)"}
Output format: clean markdown. Start directly with the contract — no preamble.`;

  const output = await completeGemini({
    system: systemPrompt,
    prompt: `Draft this contract: ${description}
${clarifications ? `Additional details: ${clarifications}` : ""}`,
    maxTokens: 6000
  });
  if (!output) return new Response(streamText(demoContract), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });

  return new Response(streamText(output), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
