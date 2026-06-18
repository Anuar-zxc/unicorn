#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

const DEFAULT_BASE_URL = "https://ows.goszakup.gov.kz";
const DEFAULT_START_URL = "/v3/contract/all";

function parseArgs(argv) {
  const options = {
    output: "data/goszakup/contracts",
    startUrl: DEFAULT_START_URL,
    maxPages: Number.POSITIVE_INFINITY,
    delayMs: 500,
    retries: 8,
    units: false,
    downloadFiles: false,
    fileConcurrency: 3,
    reset: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Для ${arg} не указано значение`);
      }
      index += 1;
      return value;
    };

    if (arg === "--output") options.output = next();
    else if (arg === "--start-url") options.startUrl = next();
    else if (arg === "--max-pages") options.maxPages = Number(next());
    else if (arg === "--delay-ms") options.delayMs = Number(next());
    else if (arg === "--retries") options.retries = Number(next());
    else if (arg === "--file-concurrency") options.fileConcurrency = Number(next());
    else if (arg === "--token") options.token = next();
    else if (arg === "--units") options.units = true;
    else if (arg === "--download-files") options.downloadFiles = true;
    else if (arg === "--reset") options.reset = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Неизвестный аргумент: ${arg}`);
  }

  for (const key of ["maxPages", "delayMs", "retries", "fileConcurrency"]) {
    if (Number.isNaN(options[key]) || options[key] < 0) {
      throw new Error(`Некорректное числовое значение: ${key}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Массовая выгрузка договоров из открытого API goszakup.gov.kz.

Использование:
  npm run goszakup:contracts -- [параметры]

Параметры:
  --output <dir>             Каталог данных (по умолчанию data/goszakup/contracts)
  --start-url <url>          Начальная API-ссылка (по умолчанию /v3/contract/all)
  --max-pages <n>            Остановиться после N страниц; удобно для проверки
  --delay-ms <n>             Пауза между страницами, мс (по умолчанию 500)
  --retries <n>              Число повторов при 429/5xx/сетевой ошибке (по умолчанию 8)
  --units                    Добавлять предметы договора через /contract/{id}/units
  --download-files           Скачивать найденные в ответе файлы/PDF
  --file-concurrency <n>     Параллельных загрузок файлов (по умолчанию 3)
  --token <token>            Bearer-токен; безопаснее задать GOSZAKUP_API_TOKEN
  --reset                    Начать заново, удалив checkpoint и страницы
  -h, --help                 Эта справка

Результат:
  pages/page-XXXXXXXX.jsonl.gz  Атомарно сохранённые страницы API
  files/                        Файлы договоров при --download-files
  checkpoint.json               Точка продолжения
  manifest.json                 Параметры и итоговая статистика
`);
}

function loadDotEnv(paths) {
  for (const path of paths) {
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  }
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function absoluteApiUrl(url) {
  return new URL(url, DEFAULT_BASE_URL).toString();
}

function atomicJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, path);
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

async function request(url, { token, retries, responseType = "json" }) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const requestUrl = new URL(absoluteApiUrl(url));
      const headers = {
          Accept: responseType === "json" ? "application/json" : "*/*",
          "User-Agent": "LexoResearch/1.0 (public procurement dataset)",
      };
      if (requestUrl.hostname === "ows.goszakup.gov.kz") {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(requestUrl, {
        headers,
        signal: AbortSignal.timeout(60_000),
      });

      if (response.ok) {
        return responseType === "json" ? response.json() : response;
      }

      const body = await response.text();
      const error = new Error(
        `HTTP ${response.status} ${response.statusText}: ${body.slice(0, 300)}`,
      );

      if (response.status === 401 || response.status === 403 || response.status === 404) {
        throw error;
      }

      if (response.status !== 429 && response.status < 500) {
        throw error;
      }

      lastError = error;
      const retryAfter = Number(response.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter)
        ? retryAfter * 1000
        : Math.min(60_000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500);
      console.warn(`Повтор ${attempt + 1}/${retries}: ${error.message}; пауза ${waitMs} мс`);
      await sleep(waitMs);
    } catch (error) {
      lastError = error;
      const fatalHttp =
        error instanceof Error && /^HTTP (401|403|404)\b/.test(error.message);
      if (fatalHttp || attempt === retries) throw error;
      const waitMs = Math.min(60_000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500);
      console.warn(`Сетевая ошибка, повтор ${attempt + 1}/${retries}; пауза ${waitMs} мс`);
      await sleep(waitMs);
    }
  }

  throw lastError;
}

function contractId(contract) {
  return contract.id ?? contract.contract_id ?? contract.pid ?? contract.sys_id ?? null;
}

function safeFilename(value) {
  return String(value || "file")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}._-]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 160);
}

function collectFileUrls(value, found = new Set(), parentKey = "") {
  if (!value) return found;
  if (Array.isArray(value)) {
    for (const item of value) collectFileUrls(item, found, parentKey);
    return found;
  }
  if (typeof value !== "object") return found;

  for (const [key, child] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (
      typeof child === "string" &&
      /^https?:\/\//i.test(child) &&
      (/(file|pdf|document|download|link|url)/i.test(normalizedKey) ||
        /\.pdf(?:$|\?)/i.test(child))
    ) {
      found.add(child);
    } else {
      collectFileUrls(child, found, normalizedKey);
    }
  }
  return found;
}

async function mapLimit(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length || 1)) },
    async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await mapper(items[index], index);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

async function downloadFile(url, destination, options) {
  if (existsSync(destination)) return { url, path: destination, skipped: true };
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = `${destination}.part`;
  const response = await request(url, { ...options, responseType: "stream" });
  if (!response.body) throw new Error(`Пустой ответ файла: ${url}`);
  await pipeline(response.body, createWriteStream(temporary));
  renameSync(temporary, destination);
  return { url, path: destination, skipped: false };
}

async function savePage(path, records) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  const output = createWriteStream(temporary);
  const gzip = createGzip({ level: 6 });
  gzip.pipe(output);
  for (const record of records) {
    if (!gzip.write(`${JSON.stringify(record)}\n`)) {
      await new Promise((resolvePromise) => gzip.once("drain", resolvePromise));
    }
  }
  gzip.end();
  await new Promise((resolvePromise, reject) => {
    output.once("finish", resolvePromise);
    output.once("error", reject);
    gzip.once("error", reject);
  });
  renameSync(temporary, path);
}

async function main() {
  loadDotEnv([
    resolve(".env.local"),
    resolve(".env"),
    resolve(".env.development.local"),
  ]);
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const token = options.token || process.env.GOSZAKUP_API_TOKEN;
  if (!token || token === "your_goszakup_bearer_token") {
    throw new Error(
      "Нет токена. Добавьте GOSZAKUP_API_TOKEN в .env.local или передайте --token.",
    );
  }

  const outputDir = resolve(options.output);
  const pagesDir = join(outputDir, "pages");
  const filesDir = join(outputDir, "files");
  const checkpointPath = join(outputDir, "checkpoint.json");
  const manifestPath = join(outputDir, "manifest.json");

  if (options.reset && existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(pagesDir, { recursive: true });
  if (options.downloadFiles) mkdirSync(filesDir, { recursive: true });

  const checkpoint = readJson(checkpointPath, {
    nextUrl: options.startUrl,
    page: 0,
    contracts: 0,
    downloadedFiles: 0,
    startedAt: new Date().toISOString(),
  });

  const manifest = {
    source: "https://goszakup.gov.kz/ru/developer/ows_v3",
    apiBaseUrl: DEFAULT_BASE_URL,
    startUrl: options.startUrl,
    outputFormat: "gzip-compressed JSON Lines; one enriched contract per line",
    includesUnits: options.units,
    downloadsFiles: options.downloadFiles,
    resumedFromPage: checkpoint.page,
    startedAt: checkpoint.startedAt,
    updatedAt: new Date().toISOString(),
    status: "running",
  };
  atomicJson(manifestPath, manifest);

  let nextUrl = checkpoint.nextUrl;
  let page = checkpoint.page;
  let contracts = checkpoint.contracts;
  let downloadedFiles = checkpoint.downloadedFiles;
  const stopAtPage = Number.isFinite(options.maxPages)
    ? checkpoint.page + options.maxPages
    : Number.POSITIVE_INFINITY;

  while (nextUrl && page < stopAtPage) {
    const pageNumber = page + 1;
    const pagePath = join(pagesDir, `page-${String(pageNumber).padStart(8, "0")}.jsonl.gz`);
    console.log(`Страница ${pageNumber}: ${absoluteApiUrl(nextUrl)}`);
    const payload = await request(nextUrl, { token, retries: options.retries });
    const items = Array.isArray(payload) ? payload : payload.items;
    if (!Array.isArray(items)) {
      throw new Error(`API не вернул массив items на странице ${pageNumber}`);
    }

    const enriched = await mapLimit(items, options.fileConcurrency, async (contract) => {
      const id = contractId(contract);
      const record = { contract };

      if (options.units && id !== null) {
        try {
          record.units = await request(`/v3/contract/${encodeURIComponent(id)}/units`, {
            token,
            retries: options.retries,
          });
        } catch (error) {
          record.units_error = error instanceof Error ? error.message : String(error);
        }
      }

      if (options.downloadFiles) {
        const urls = [...collectFileUrls(record)];
        record.downloaded_files = await mapLimit(
          urls,
          options.fileConcurrency,
          async (fileUrl, fileIndex) => {
            try {
              const parsed = new URL(fileUrl);
              const urlName = safeFilename(basename(parsed.pathname)) || "contract.pdf";
              const hash = createHash("sha256").update(fileUrl).digest("hex").slice(0, 16);
              const idPart = safeFilename(id ?? "unknown");
              const destination = join(
                filesDir,
                idPart,
                `${String(fileIndex + 1).padStart(2, "0")}-${hash}-${urlName}`,
              );
              const result = await downloadFile(fileUrl, destination, {
                token,
                retries: options.retries,
              });
              if (!result.skipped) downloadedFiles += 1;
              return { url: fileUrl, path: destination.slice(outputDir.length + 1) };
            } catch (error) {
              return {
                url: fileUrl,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          },
        );
      }

      return record;
    });

    await savePage(pagePath, enriched);
    page = pageNumber;
    contracts += items.length;
    nextUrl = payload.next_page || payload.nextPage || null;

    atomicJson(checkpointPath, {
      nextUrl,
      page,
      contracts,
      downloadedFiles,
      totalReportedByApi: payload.total ?? checkpoint.totalReportedByApi ?? null,
      startedAt: checkpoint.startedAt,
      updatedAt: new Date().toISOString(),
    });
    console.log(
      `Сохранено: ${items.length}; всего договоров: ${contracts}; файлов: ${downloadedFiles}`,
    );
    if (nextUrl && options.delayMs > 0) await sleep(options.delayMs);
  }

  atomicJson(manifestPath, {
    ...manifest,
    updatedAt: new Date().toISOString(),
    finishedAt: nextUrl ? null : new Date().toISOString(),
    status: nextUrl ? "paused" : "completed",
    pages: page,
    contracts,
    downloadedFiles,
    nextUrl,
  });

  console.log(
    nextUrl
      ? `Выгрузка приостановлена после ${page} страниц. Повторный запуск продолжит автоматически.`
      : `Выгрузка завершена: ${contracts} договоров.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
