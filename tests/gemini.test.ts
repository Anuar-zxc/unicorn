import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { completeGemini, streamGemini } from "../lib/gemini.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});
process.env.GEMINI_API_KEY = "test-key";

function sse(frames: string[], splitEvery = 7) {
  const body = frames.map((text) => `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\r\n\r\n`).join("");
  const bytes = new TextEncoder().encode(body);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      // Deliberately split frames at awkward byte boundaries.
      for (let i = 0; i < bytes.length; i += splitEvery) controller.enqueue(bytes.slice(i, i + splitEvery));
      controller.close();
    }
  });
}

test("stream keeps whitespace between chunks and sends the key in a header", async () => {
  let seenUrl = "";
  let seenKey = "";
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    seenUrl = String(url);
    seenKey = (init.headers as Record<string, string>)["x-goog-api-key"];
    return new Response(sse(["## Ответ\n", "Да, ", "можно.", " Статья 541."]), { status: 200 });
  }) as typeof fetch;

  let text = "";
  for await (const chunk of streamGemini({ system: "s", prompt: "p" })) text += chunk;
  assert.equal(text, "## Ответ\nДа, можно. Статья 541.");
  assert.ok(!seenUrl.includes("test-key"), "API key must not be in the URL");
  assert.equal(seenKey, "test-key");
});

test("retries once on 503 then succeeds", async () => {
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    if (calls === 1) return new Response("overloaded", { status: 503 });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: " ok " }] } }] }), { status: 200 });
  }) as typeof fetch;
  assert.equal(await completeGemini({ system: "s", prompt: "p" }), "ok");
  assert.equal(calls, 2);
});

test("does not retry on 400", async () => {
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response("bad request", { status: 400 });
  }) as typeof fetch;
  await assert.rejects(completeGemini({ system: "s", prompt: "p" }), /400/);
  assert.equal(calls, 1);
});
