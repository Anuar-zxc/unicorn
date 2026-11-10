/** Client-side export helpers for AI output (no extra dependencies). */

function safeFileName(title: string) {
  const base = title
    .replace(/[\\/:*?"<>|\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return base || "lexo-document";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

/**
 * Downloads rendered HTML as a .doc file that Word, Google Docs and Pages open
 * with headings, lists and tables intact.
 */
export function downloadWord(title: string, bodyHtml: string, footer?: string) {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;color:#111}
h1{font-size:18pt}h2{font-size:14pt;margin-top:16pt}h3{font-size:12pt}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:4pt 6pt;vertical-align:top}
th{background:#f2f4f7}blockquote{border-left:3px solid #1a56e8;margin:8pt 0;padding:4pt 10pt;color:#444}
.footer{margin-top:24pt;font-size:9pt;color:#666}
</style></head>
<body><h1>${escapeHtml(title)}</h1>${bodyHtml}${
    footer ? `<p class="footer">${escapeHtml(footer)}</p>` : ""
  }</body></html>`;
  triggerDownload(
    new Blob(["﻿", html], { type: "application/msword" }),
    `${safeFileName(title)}.doc`
  );
}

export function downloadMarkdown(title: string, markdown: string) {
  triggerDownload(
    new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    `${safeFileName(title)}.md`
  );
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the async clipboard API.
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}
