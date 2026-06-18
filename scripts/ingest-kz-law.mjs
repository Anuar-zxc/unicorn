import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import * as cheerio from "cheerio";

const execFileAsync = promisify(execFile);
const dataDir = new URL("../data/kz-law/", import.meta.url);
const sources = JSON.parse(await readFile(new URL("sources.json", dataDir), "utf8"));
const requested = process.argv.find((arg) => arg.startsWith("--only="))?.split("=")[1]?.split(",");
const selected = requested ? sources.filter((source) => requested.includes(source.id)) : sources;
await mkdir(new URL("raw/", dataDir), { recursive: true });
const chunks = [];
const manifest = [];

for (const source of selected) {
  process.stdout.write(`Fetching ${source.title}...\n`);
  const { stdout: html } = await execFileAsync("curl", ["-k","-L","-sS","--retry","3","--max-time","180",source.url], { maxBuffer: 30 * 1024 * 1024 });
  await writeFile(new URL(`raw/${source.id}.html`, dataDir), html);
  const $ = cheerio.load(html);
  $("script,style,noscript,nav,header,footer,.note").remove();
  const title = $("title").first().text().replace(/\s+-\s+ИПС.*$/, "").trim() || source.title;
  let articleCount = 0;
  $("h3").each((_, element) => {
    const heading = clean($(element).text());
    if (!/^Статья\s+\d/i.test(heading)) return;
    const parts = [];
    let node = $(element).next();
    while (node.length && node[0]?.tagName !== "h3") {
      const text = clean(node.text());
      if (text && !/^Сноска\./i.test(text)) parts.push(text);
      node = node.next();
    }
    const body = parts.join("\n");
    if (body.length < 40) return;
    articleCount += 1;
    const articleNumber = heading.match(/^Статья\s+([\d-]+)/i)?.[1] ?? articleCount;
    chunks.push({ id:`${source.id}:${articleNumber}`, sourceId:source.id, title, article:heading, text:body, url:`${source.url}#${$(element).attr("id") ?? ""}`, authority:source.authority, language:source.language, fetchedAt:new Date().toISOString() });
  });
  manifest.push({ ...source, resolvedTitle:title, articleCount, fetchedAt:new Date().toISOString() });
  process.stdout.write(`  ${articleCount} articles indexed\n`);
}
await writeFile(new URL("chunks.json", dataDir), JSON.stringify(chunks, null, 2));
await writeFile(new URL("manifest.json", dataDir), JSON.stringify(manifest, null, 2));
process.stdout.write(`Done: ${chunks.length} legal articles\n`);

function clean(value) {
  return value.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n").trim();
}
