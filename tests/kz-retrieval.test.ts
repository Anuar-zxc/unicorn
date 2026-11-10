import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLegalIndex, searchLegalIndex, stem, type LegalChunk } from "../lib/kz-retrieval.ts";

const chunks = JSON.parse(readFileSync(new URL("../data/kz-law/chunks.json", import.meta.url), "utf8")) as LegalChunk[];
const index = buildLegalIndex(chunks);
const top = (query: string, k = 3) => searchLegalIndex(index, query, k).map((chunk) => chunk.id);

test("stemmer folds common Russian endings", () => {
  assert.equal(stem("арендодателя"), stem("арендодатель"));
  assert.equal(stem("договора"), stem("договор"));
});

test("finds the right article for everyday questions", () => {
  assert.ok(top("общий срок исковой давности").includes("civil-code-general:178"));
  assert.ok(top("договор займа письменная форма").includes("civil-code-special:716"));
  assert.ok(top("испытательный срок при приеме на работу").some((id) => id.startsWith("labor-code:3")));
  assert.ok(top("согласие на сбор и обработку персональных данных").includes("personal-data-law:8"));
});

test("empty and stop-word-only queries return nothing", () => {
  assert.deepEqual(top(""), []);
  assert.deepEqual(top("и в на"), []);
});
