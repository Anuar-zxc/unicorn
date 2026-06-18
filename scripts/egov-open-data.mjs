#!/usr/bin/env node

import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE_URL = "https://data.egov.kz";
const DEFAULT_KEYWORDS = [
  "договор",
  "договоры",
  "контракт",
  "контракты",
  "закуп",
  "закупки",
  "тендер",
  "конкурс",
  "право",
  "суд",
  "суды",
  "судеб",
  "юрид",
  "лизинг",
  "аренда",
  "финанс",
  "мемлекеттік сатып алу",
  "шарт",
  "келісім",
];

function parseArgs(argv) {
  const options = {
    output: "data/egov/open-data",
    pages: 50,
    pageSize: 100,
    rowsPerDataset: 100,
    delayMs: 250,
    keywords: DEFAULT_KEYWORDS,
    downloadRows: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };

    if (arg === "--output") options.output = next();
    else if (arg === "--pages") options.pages = Number(next());
    else if (arg === "--page-size") options.pageSize = Number(next());
    else if (arg === "--rows-per-dataset") options.rowsPerDataset = Number(next());
    else if (arg === "--delay-ms") options.delayMs = Number(next());
    else if (arg === "--keywords") {
      options.keywords = next()
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg === "--metadata-only") options.downloadRows = false;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`
Public data.egov.kz collector for Lexo training/RAG data.

Usage:
  npm run egov:open-data -- [options]

Options:
  --output <dir>              Output directory, default data/egov/open-data
  --pages <n>                 Dataset catalogue pages to crawl, default 50
  --page-size <n>             Datasets per page, default 100
  --rows-per-dataset <n>      Rows to export for each matching dataset, default 100
  --keywords <csv>            Comma-separated filter keywords
  --metadata-only             Save matching metadata without row exports
  --delay-ms <n>              Delay between requests, default 250
  -h, --help                  Show help

Output:
  matched-datasets.jsonl      Dataset metadata matching the keywords
  rows/<apiUri>.json          Public exported rows for matched datasets
  manifest.json               Crawl settings and stats
`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureParent(path) {
  mkdirSync(dirname(path), { recursive: true });
}

async function requestJson(path, options = {}) {
  const url = new URL(path, BASE_URL);
  if (options.search) {
    for (const [key, value] of Object.entries(options.search)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      Referer: `${BASE_URL}/datasets/listbycategory`,
      "User-Agent": "LexoResearch/1.0 (public open-data collector)",
      "X-Requested-With": "XMLHttpRequest",
    },
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${await response.text()}`);
  }

  return response.json();
}

function datasetText(dataset) {
  return [
    dataset.apiUri,
    dataset.nameRu,
    dataset.nameKk,
    dataset.nameEn,
    dataset.descriptionRu,
    dataset.descriptionKk,
    dataset.descriptionEn,
    dataset.govAgency?.nameRu,
    dataset.govAgency?.nameKk,
    ...(dataset.keyWords ?? dataset.keywords ?? []),
    ...(dataset.categories ?? []).flatMap((category) => [
      category.nameRu,
      category.nameKk,
      category.nameEn,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchDataset(dataset, keywords) {
  const text = datasetText(dataset);
  return keywords.filter((keyword) => {
    const normalized = keyword.toLowerCase();
    if (/^[\p{L}\p{N}_-]+$/u.test(normalized)) {
      return new RegExp(`(^|[^\\p{L}\\p{N}_-])${escapeRegExp(normalized)}`, "u").test(text);
    }
    return text.includes(normalized);
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeName(value) {
  return String(value || "dataset")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}._-]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 140);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  mkdirSync(options.output, { recursive: true });
  mkdirSync(join(options.output, "rows"), { recursive: true });

  const matchedPath = join(options.output, "matched-datasets.jsonl");
  const matchedStream = createWriteStream(matchedPath, { flags: "w" });
  const stats = {
    source: BASE_URL,
    startedAt: new Date().toISOString(),
    pagesRequested: options.pages,
    pageSize: options.pageSize,
    rowsPerDataset: options.rowsPerDataset,
    keywords: options.keywords,
    scannedDatasets: 0,
    matchedDatasets: 0,
    exportedDatasets: 0,
    errors: [],
  };

  for (let page = 1; page <= options.pages; page += 1) {
    let payload;
    try {
      payload = await requestJson("/datasets/getdatasetsre", {
        search: {
          page,
          count: options.pageSize,
          byGovAgencyId: "",
          categoryId: "",
          statusType: "",
          datasetSortSelect: "",
          status: "PUBLISHED",
        },
      });
    } catch (error) {
      stats.errors.push({ page, message: error instanceof Error ? error.message : String(error) });
      continue;
    }

    const datasets = payload.datasets ?? [];
    if (!datasets.length) break;

    for (const dataset of datasets) {
      stats.scannedDatasets += 1;
      const matches = matchDataset(dataset, options.keywords);
      if (!matches.length) continue;

      stats.matchedDatasets += 1;
      const record = {
        apiUri: dataset.apiUri,
        id: dataset.id,
        nameRu: dataset.nameRu,
        nameKk: dataset.nameKk,
        descriptionRu: dataset.descriptionRu,
        descriptionKk: dataset.descriptionKk,
        govAgency: dataset.govAgency?.nameRu ?? dataset.govAgency?.nameKk ?? null,
        categories: (dataset.categories ?? []).map((category) => category.nameRu ?? category.nameKk),
        keywords: dataset.keyWords ?? dataset.keywords ?? [],
        matchedKeywords: matches,
        url: `${BASE_URL}/datasets/view?index=${encodeURIComponent(dataset.apiUri)}`,
        metaUrl: `${BASE_URL}/meta/${encodeURIComponent(dataset.apiUri)}/v1?pretty`,
        exportJsonUrl: `${BASE_URL}/datasets/exportjson?index=${encodeURIComponent(dataset.apiUri)}&version=v1&from=1&count=${options.rowsPerDataset}`,
      };
      matchedStream.write(`${JSON.stringify(record)}\n`);

      if (options.downloadRows) {
        try {
          const rows = await requestJson("/datasets/exportjson", {
            search: {
              index: dataset.apiUri,
              version: "v1",
              from: 1,
              count: options.rowsPerDataset,
            },
          });
          const rowsPath = join(options.output, "rows", `${safeName(dataset.apiUri)}.json`);
          ensureParent(rowsPath);
          writeFileSync(rowsPath, `${JSON.stringify(rows, null, 2)}\n`);
          stats.exportedDatasets += 1;
        } catch (error) {
          stats.errors.push({
            dataset: dataset.apiUri,
            message: error instanceof Error ? error.message.slice(0, 500) : String(error),
          });
        }
        await sleep(options.delayMs);
      }
    }

    console.log(
      `page ${page}/${options.pages}: scanned=${stats.scannedDatasets}, matched=${stats.matchedDatasets}, exported=${stats.exportedDatasets}`,
    );
    await sleep(options.delayMs);
  }

  matchedStream.end();
  stats.finishedAt = new Date().toISOString();
  writeFileSync(join(options.output, "manifest.json"), `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Done. Matched ${stats.matchedDatasets} datasets. Output: ${options.output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
