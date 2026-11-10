import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildSystemPrompt, type ResponseMode } from "@/lib/ai-prompts";
import type { AILanguage } from "@/lib/ai-language";
import {
  buildLegalIndex,
  searchLegalIndex,
  type LegalChunk,
  type LegalIndex
} from "@/lib/kz-retrieval";

let indexPromise: Promise<LegalIndex> | null = null;

/** Loads the Adilet corpus once per server instance and builds the BM25 index. */
function getIndex() {
  if (!indexPromise) {
    indexPromise = readFile(
      path.join(process.cwd(), "data", "kz-law", "chunks.json"),
      "utf8"
    )
      .then((raw) => buildLegalIndex(JSON.parse(raw) as LegalChunk[]))
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }
  return indexPromise;
}

export async function retrieveKzLaw(query: string, limit = 7) {
  return searchLegalIndex(await getIndex(), query, limit);
}

/**
 * Self-hosted answer engine (Ollama). Only used when OLLAMA_BASE_URL is set,
 * so production on Vercel goes straight to Gemini instead of timing out on
 * a localhost connection first.
 */
export async function streamLocalLegalAnswer(
  query: string,
  context: string,
  mode: ResponseMode = "concise",
  language: AILanguage = "ru"
) {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) throw new Error("OLLAMA_BASE_URL is not configured.");
  const sources = await retrieveKzLaw(`${query} ${context}`);
  if (!sources.length) throw new Error("В локальном корпусе не найдены релевантные статьи.");
  const evidence = sources
    .map(
      (source, index) =>
        `[${index + 1}] ${source.title}, ${source.article}\n${source.text}\nИсточник: ${source.url}`
    )
    .join("\n\n");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL ?? "llama3:latest",
      stream: true,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(
            "You are Lexo KZ, a legal researcher grounded only in the supplied official extracts from Kazakhstan's Adilet legal information system. Never invent legal rules. Add a bracket citation to every legal claim. If the evidence is insufficient, say so. Structure the answer as a legal question, applicable law, analysis, conclusion, and sources, with headings translated into the output language.",
            mode,
            language
          )
        },
        {
          role: "user",
          content: `Вопрос: ${query}\nКонтекст: ${context || "не указан"}\n\nОфициальные выдержки:\n${evidence}`
        }
      ]
    })
  });
  if (!response.ok || !response.body) {
    throw new Error(`Ollama error ${response.status}: ${await response.text()}`);
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const body = response.body;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const text = JSON.parse(line).message?.content ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Skip malformed frames instead of killing the whole answer.
            }
          }
        }
      } finally {
        controller.close();
      }
    }
  });
}
