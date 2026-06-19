#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const datasetDir = path.join(root, "data", "training", "kz-legal-v1");
const STOP = new Set([
  "что",
  "устанавливает",
  "предусматривает",
  "законодательство",
  "республики",
  "казахстан",
  "казахстана",
  "вопросу",
  "документа"
]);
const corpus = await readJsonl(path.join(datasetDir, "corpus.jsonl"));
const tests = await readJsonl(path.join(datasetDir, "test.retrieval.jsonl"));

const ranked = tests.map((test) => {
  const terms = tokenize(test.query);
  const results = corpus
    .map((chunk) => ({ id: chunk.id, score: score(chunk, terms) }))
    .sort((left, right) => right.score - left.score);
  const rank = results.findIndex((result) => result.id === test.positive_chunk_id) + 1;
  return {
    id: test.id,
    query: test.query,
    expected: test.positive_chunk_id,
    rank: rank || null,
    top5: results.slice(0, 5)
  };
});

const metrics = {
  evaluated_at: new Date().toISOString(),
  engine: "lexical-baseline-v1",
  examples: ranked.length,
  recall_at_1: recallAt(ranked, 1),
  recall_at_3: recallAt(ranked, 3),
  recall_at_5: recallAt(ranked, 5),
  recall_at_10: recallAt(ranked, 10),
  mean_reciprocal_rank:
    ranked.reduce((total, item) => total + (item.rank ? 1 / item.rank : 0), 0) /
    Math.max(1, ranked.length)
};

await writeFile(
  path.join(datasetDir, "retrieval-eval.json"),
  `${JSON.stringify({ metrics, failures: ranked.filter((item) => !item.rank || item.rank > 5) }, null, 2)}\n`
);
console.log(JSON.stringify(metrics, null, 2));

function recallAt(items, k) {
  return items.filter((item) => item.rank && item.rank <= k).length / Math.max(1, items.length);
}

function tokenize(value) {
  return [
    ...new Set(
      String(value)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}-]+/gu, " ")
        .split(/\s+/)
        .filter((term) => term.length > 2 && !STOP.has(term))
    )
  ];
}

function score(chunk, terms) {
  const heading = `${chunk.title} ${chunk.article}`.toLowerCase();
  const body = chunk.text.toLowerCase();
  return terms.reduce(
    (total, term) =>
      total +
      (heading.includes(term) ? 8 : 0) +
      Math.min(4, body.split(term).length - 1),
    0
  );
}

async function readJsonl(filePath) {
  return (await readFile(filePath, "utf8"))
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}
