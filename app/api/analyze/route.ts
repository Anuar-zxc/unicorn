import { ANALYZER_SYSTEM } from "@/lib/ai-system";
import { createToolHandler } from "@/lib/stream-tool";

export const maxDuration = 60;

/**
 * Public contract-analysis API (markdown stream).
 * Previously this route had no auth and no quota, which let anyone use the
 * Gemini key for free. It now goes through the same auth + plan limits as
 * every other AI tool.
 */
const handler = createToolHandler(
  `${ANALYZER_SYSTEM}

Return a structured markdown report with translated headings for: executive summary, risk breakdown (table with clause, plain meaning, risk HIGH/MEDIUM/LOW, suggestion), negotiation playbook, and questions for a lawyer.`,
  { feature: "analyses", toolType: "analysis" }
);

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const incoming = await req.formData();
    const outgoing = new FormData();
    const file = incoming.get("contract") ?? incoming.get("files");
    if (file instanceof File) outgoing.append("files", file);
    for (const key of ["input", "context", "mode", "language"]) {
      const value = incoming.get(key);
      if (typeof value === "string") outgoing.set(key, value);
    }
    if (!outgoing.get("input")) outgoing.set("input", "Analyze the attached contract.");
    return handler(new Request(req.url, { method: "POST", body: outgoing }));
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = typeof body.text === "string" ? body.text : typeof body.contractText === "string" ? body.contractText : "";
  return handler(
    new Request(req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text ? `Analyze this contract text:\n\n${text}` : "",
        mode: body.mode,
        language: body.language
      })
    })
  );
}
