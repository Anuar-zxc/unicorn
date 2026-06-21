import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildSystemPrompt, type ResponseMode } from "@/lib/ai-prompts";

type LegalChunk = { id:string; sourceId:string; title:string; article:string; text:string; url:string; authority:string; language:string; fetchedAt:string };
let cache: LegalChunk[] | null = null;

export async function retrieveKzLaw(query: string, limit = 7) {
  if (!cache) cache = JSON.parse(await readFile(path.join(process.cwd(), "data", "kz-law", "chunks.json"), "utf8"));
  const terms = tokenize(query);
  return cache!.map((chunk) => ({ chunk, score: score(chunk, terms) })).filter((item) => item.score > 0).sort((a,b) => b.score-a.score).slice(0,limit).map((item) => item.chunk);
}

export async function streamLocalLegalAnswer(
  query: string,
  context: string,
  mode: ResponseMode = "concise"
) {
  const sources = await retrieveKzLaw(`${query} ${context}`);
  if (!sources.length) throw new Error("В локальном корпусе не найдены релевантные статьи.");
  const evidence = sources.map((source,index) => `[${index+1}] ${source.title}, ${source.article}\n${source.text}\nИсточник: ${source.url}`).join("\n\n");
  const response = await fetch(`${process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"}/api/chat`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:process.env.OLLAMA_MODEL ?? "llama3:latest",
      stream:true,
      messages:[
        {role:"system",content:buildSystemPrompt("Ты — Lexo KZ, локальный юридический исследователь для юристов Казахстана. Отвечай только по официальным выдержкам ИПС «Әділет». Не выдумывай нормы. Каждое юридическое утверждение сопровождай ссылкой [номер]. Если данных недостаточно, скажи об этом. Формат: ## Правовой вопрос; ## Применимое право; ## Анализ; ## Вывод; ## Источники. Отвечай профессионально на русском языке.", mode)},
        {role:"user",content:`Вопрос: ${query}\nКонтекст: ${context || "не указан"}\n\nОфициальные выдержки:\n${evidence}`}
      ]
    })
  });
  if (!response.ok || !response.body) throw new Error(`Ollama error ${response.status}: ${await response.text()}`);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const {value,done} = await reader.read();
          if (done) break;
          buffer += decoder.decode(value,{stream:true});
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const text = JSON.parse(line).message?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        }
      } finally { controller.close(); }
    }
  });
}

const TOKEN_SPLIT_PATTERN = new RegExp("[^\\p{L}\\p{N}-]+", "gu");
function tokenize(value:string) { return Array.from(new Set(value.toLowerCase().replace(TOKEN_SPLIT_PATTERN," ").split(/\s+/).filter((term) => term.length > 2 && !STOP.has(term)))); }
function score(chunk:LegalChunk, terms:string[]) { const heading=`${chunk.title} ${chunk.article}`.toLowerCase(); const body=chunk.text.toLowerCase(); return terms.reduce((total,term) => total+(heading.includes(term)?6:0)+Math.min(4,body.split(term).length-1),0); }
const STOP = new Set(["какие","какой","может","нужно","если","либо","этого","этот","быть","право","закону","казахстана","республики"]);
