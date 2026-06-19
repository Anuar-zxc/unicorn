#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "data", "kz-law", "chunks.json");
const outputDir = path.join(root, "data", "training", "kz-legal-v1");
const chunks = JSON.parse(await readFile(inputPath, "utf8"));

const cleanChunks = chunks
  .filter((chunk) => chunk?.id && chunk?.article && chunk?.text?.length >= 80)
  .map((chunk) => ({
    ...chunk,
    text: clean(chunk.text),
    article: clean(chunk.article)
  }));

const splitBySource = new Map();
for (const chunk of cleanChunks) {
  const sourceChunks = splitBySource.get(chunk.sourceId) ?? [];
  sourceChunks.push(chunk);
  splitBySource.set(chunk.sourceId, sourceChunks);
}

const records = cleanChunks.map((chunk) => {
  const split = stableSplit(chunk.id);
  const peers = splitBySource.get(chunk.sourceId) ?? [];
  const index = peers.findIndex((item) => item.id === chunk.id);
  const negatives = [
    peers[(index + 1) % peers.length],
    peers[(index + Math.max(2, Math.floor(peers.length / 3))) % peers.length]
  ]
    .filter(Boolean)
    .filter((item) => item.id !== chunk.id)
    .map((item) => item.id);

  return {
    split,
    retrieval: {
      id: `retrieval:${chunk.id}`,
      query: buildQuery(chunk),
      positive_chunk_id: chunk.id,
      hard_negative_chunk_ids: [...new Set(negatives)],
      source_id: chunk.sourceId,
      language: chunk.language
    },
    instruction: {
      id: `instruction:${chunk.id}`,
      messages: [
        {
          role: "system",
          content:
            "Ты — юридический ассистент по праву Казахстана. Отвечай только по предоставленной норме, не выдумывай право и всегда указывай источник."
        },
        {
          role: "user",
          content: `${buildQuery(chunk)}\n\nНорма:\n${chunk.article}\n${chunk.text}`
        },
        {
          role: "assistant",
          content: buildExtractiveAnswer(chunk)
        }
      ],
      metadata: {
        chunk_id: chunk.id,
        source_id: chunk.sourceId,
        source_url: chunk.url,
        generated_by: "deterministic-extractive-v1",
        requires_expert_review: true
      }
    }
  };
});

await mkdir(outputDir, { recursive: true });
for (const split of ["train", "dev", "test"]) {
  const selected = records.filter((record) => record.split === split);
  await writeJsonl(
    path.join(outputDir, `${split}.retrieval.jsonl`),
    selected.map((record) => record.retrieval)
  );
  await writeJsonl(
    path.join(outputDir, `${split}.instruction.jsonl`),
    selected.map((record) => record.instruction)
  );
}

await writeJsonl(
  path.join(outputDir, "corpus.jsonl"),
  cleanChunks.map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    article: chunk.article,
    text: chunk.text,
    source_id: chunk.sourceId,
    url: chunk.url,
    authority: chunk.authority,
    language: chunk.language
  }))
);

const counts = Object.fromEntries(
  ["train", "dev", "test"].map((split) => [
    split,
    records.filter((record) => record.split === split).length
  ])
);
const manifest = {
  name: "kz-legal-v1",
  created_at: new Date().toISOString(),
  source: "Official legal texts from ИПС «Әділет»",
  input: path.relative(root, inputPath),
  output: path.relative(root, outputDir),
  chunks: cleanChunks.length,
  sources: [...new Set(cleanChunks.map((chunk) => chunk.sourceId))],
  splits: counts,
  uses_client_documents: false,
  intended_uses: [
    "retrieval evaluation",
    "reranker or embedding training after expert review",
    "instruction fine-tuning after expert review"
  ],
  warning:
    "Instruction examples are extractive seed data and must be reviewed by a Kazakhstan-qualified legal expert before fine-tuning."
};
await writeFile(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);

console.log(JSON.stringify(manifest, null, 2));

function buildQuery(chunk) {
  const subject = chunk.article
    .replace(/^Статья\s+[\d-]+\.?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (subject && subject !== chunk.article) {
    return `Что устанавливает законодательство Республики Казахстан по вопросу «${subject}»?`;
  }
  const firstRule = chunk.text
    .split("\n")
    .filter((line) => !/^Примечание\./i.test(line.trim()))
    .join(" ")
    .replace(/^\d+(?:[.-]\d+)?[.)]?\s*/, "")
    .split(/(?<=[.!?])\s+/)[0]
    .slice(0, 220)
    .trim();
  return `Какая норма права Казахстана применяется к следующему вопросу: «${firstRule}»?`;
}

function buildExtractiveAnswer(chunk) {
  const excerpt = chunk.text.slice(0, 1800).trim();
  return `${chunk.article} документа «${chunk.title}» устанавливает следующее:\n\n${excerpt}\n\nИсточник: ${chunk.authority}, ${chunk.url}`;
}

function stableSplit(id) {
  const value = Number.parseInt(createHash("sha256").update(id).digest("hex").slice(0, 8), 16) % 100;
  if (value < 80) return "train";
  if (value < 90) return "dev";
  return "test";
}

function clean(value) {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

async function writeJsonl(filePath, values) {
  await writeFile(filePath, `${values.map((value) => JSON.stringify(value)).join("\n")}\n`);
}
