"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  FileDiff,
  FileDown,
  FileUp,
  FolderKanban,
  Loader2,
  MessageCircleQuestion,
  MessageSquareText,
  Play,
  RotateCcw,
  Square,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradePrompt } from "@/components/shared/UpgradePrompt";
import { ResponseModeToggle } from "@/components/shared/ResponseModeToggle";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import { Markdown } from "@/components/shared/Markdown";
import { useLanguage } from "@/components/providers/AppProviders";
import { TOOL_CONFIGS, type ToolKey } from "@/components/dashboard/tool-configs";
import { copyToClipboard, downloadMarkdown, downloadWord } from "@/lib/export";
import type { ResponseMode } from "@/lib/ai-prompts";
import type { AILanguage } from "@/lib/ai-language";
import { cn } from "@/lib/utils";

const toolIcons = {
  ask: MessageCircleQuestion,
  research: BookOpen,
  caseprep: FolderKanban,
  compare: FileDiff,
  client: MessageSquareText
} as const;

const ACCEPT =
  ".pdf,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,image/heic,image/heif";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ui = {
  ru: {
    upload: "Загрузите PDF, DOCX или фото",
    uploadTwo: "Загрузите две версии: PDF, DOCX или фото",
    drop: "или перетащите файл сюда",
    needInput: "Добавьте текст или файл перед запуском.",
    needTwo: "Добавьте обе версии для сравнения.",
    tooLarge: "Файл больше 10 МБ.",
    working: "Lexo готовит ответ…",
    stop: "Остановить",
    copy: "Копировать",
    copied: "Скопировано",
    word: "Word",
    markdown: "Markdown",
    deliverable: "Результат",
    empty: (label: string) => `Здесь появится: ${label.toLowerCase()}.`,
    emptyHint: "Ответ появляется по мере генерации. Его можно скопировать или скачать.",
    reset: "Новый запрос",
    disclaimerPersonal: "Это правовая информация, а не консультация. Для важных решений проверьте выводы с юристом.",
    disclaimerPro: "Подготовлено с помощью AI — проверьте перед передачей клиенту.",
    limit: "Лимит тарифа на этот месяц исчерпан.",
    auth: "Сессия истекла. Войдите снова.",
    failed: "Не удалось выполнить запрос. Попробуйте ещё раз.",
    stopped: "\n\n_Генерация остановлена._",
    shortcut: "Ctrl + Enter — запустить",
    chars: "символов"
  },
  en: {
    upload: "Upload PDF, DOCX, or image",
    uploadTwo: "Upload two PDF, DOCX, or image versions",
    drop: "or drop a file here",
    needInput: "Add text or a file before running the tool.",
    needTwo: "Add both versions to compare.",
    tooLarge: "File is larger than 10 MB.",
    working: "Lexo is working…",
    stop: "Stop",
    copy: "Copy",
    copied: "Copied",
    word: "Word",
    markdown: "Markdown",
    deliverable: "Deliverable",
    empty: (label: string) => `Your ${label.toLowerCase()} will stream here.`,
    emptyHint: "The answer appears as it is generated. Copy it or download it when ready.",
    reset: "New request",
    disclaimerPersonal: "This is legal information, not legal advice. Check important decisions with a lawyer.",
    disclaimerPro: "AI-assisted output — review before client delivery.",
    limit: "You have reached this month's plan limit.",
    auth: "Your session expired. Please sign in again.",
    failed: "The request could not be completed. Please try again.",
    stopped: "\n\n_Generation stopped._",
    shortcut: "Ctrl + Enter to run",
    chars: "characters"
  }
};

export function ToolWorkspace({ tool }: { tool: ToolKey }) {
  const { locale } = useLanguage();
  const config = TOOL_CONFIGS[tool];
  const copy = config[locale];
  const t = ui[locale];

  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<ResponseMode>("concise");
  const [language, setLanguage] = useState<AILanguage>(locale);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const maxFiles = config.upload === "double" ? 2 : 1;

  useEffect(() => () => abortRef.current?.abort(), []);

  function addFiles(list: FileList | File[]) {
    const next = Array.from(list);
    if (next.some((file) => file.size > MAX_FILE_BYTES)) {
      setError(t.tooLarge);
      return;
    }
    setError("");
    setFiles((current) => [...current, ...next].slice(-maxFiles));
  }

  async function run() {
    if (loading) return;
    if (!input.trim() && files.length === 0) return setError(t.needInput);
    if (config.upload === "double" && files.length < 2 && !secondaryInput.trim()) return setError(t.needTwo);
    setLoading(true);
    setError("");
    setLimitReached(false);
    setOutput("");
    setCopied(false);
    const controller = new AbortController();
    abortRef.current = controller;
    let result = "";
    try {
      let body: BodyInit;
      let headers: HeadersInit | undefined;
      if (files.length) {
        const data = new FormData();
        data.set("input", [input, secondaryInput].filter(Boolean).join("\n\n--- SECOND VERSION ---\n"));
        data.set("context", context);
        data.set("mode", mode);
        data.set("language", language);
        files.forEach((file) => data.append("files", file));
        body = data;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ input, secondaryInput, context, mode, language });
      }
      const response = await fetch(config.endpoint, { method: "POST", headers, body, signal: controller.signal });
      if (!response.ok || !response.body) {
        const message = await response.text();
        if (response.status === 403 && message.includes("PLAN_LIMIT")) {
          setLimitReached(true);
          throw new Error(t.limit);
        }
        if (response.status === 401) throw new Error(t.auth);
        throw new Error(response.status === 400 && message ? message : t.failed);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        if (result) setOutput(result + t.stopped);
      } else {
        setError(caught instanceof Error ? caught.message : t.failed);
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  function exportWord() {
    downloadWord(copy.outputLabel, outputRef.current?.innerHTML ?? "", t.disclaimerPro);
  }

  const Icon = toolIcons[config.icon];
  const inputClass =
    "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-4 text-sm leading-6 outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15";

  return (
    <main className="p-4 md:p-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="no-print rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-light)] text-[var(--accent)]"><Icon className="h-5 w-5" aria-hidden /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[var(--accent)]">{copy.eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{copy.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ResponseModeToggle mode={mode} onChange={setMode} />
            <LanguageModeToggle language={language} onChange={setLanguage} />
          </div>

          {config.upload && (
            <div className="mt-6">
              <input
                ref={fileRef}
                type="file"
                multiple={maxFiles > 1}
                accept={ACCEPT}
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  addFiles(event.dataTransfer.files);
                }}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-6 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent)]",
                  dragging ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--border-strong)] bg-[var(--bg-page)]"
                )}
              >
                <span className="flex items-center gap-2 font-medium text-[var(--text-primary)]"><FileUp className="h-5 w-5 text-[var(--accent)]" aria-hidden />{maxFiles > 1 ? t.uploadTwo : t.upload}</span>
                <span className="text-xs text-[var(--text-muted)]">{t.drop} · ≤ 10 MB</span>
              </button>
              {files.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] py-1 pl-3 pr-1 text-xs">
                      <span className="max-w-[220px] truncate">{file.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                        className="rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <label htmlFor={`${tool}-input`} className="mt-6 block text-sm font-medium">{copy.inputLabel}</label>
          <textarea
            id={`${tool}-input`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void run();
            }}
            placeholder={copy.inputPlaceholder}
            className={cn(inputClass, "min-h-40 resize-y")}
          />
          <div className="mt-1 flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>{t.shortcut}</span>
            <span>{input.length.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")} {t.chars}</span>
          </div>

          {copy.secondaryLabel && (
            <>
              <label htmlFor={`${tool}-secondary`} className="mt-5 block text-sm font-medium">{copy.secondaryLabel}</label>
              <textarea id={`${tool}-secondary`} value={secondaryInput} onChange={(event) => setSecondaryInput(event.target.value)} placeholder={copy.secondaryPlaceholder} className={cn(inputClass, "min-h-32 resize-y")} />
            </>
          )}
          {copy.contextLabel && (
            <>
              <label htmlFor={`${tool}-context`} className="mt-5 block text-sm font-medium">{copy.contextLabel}</label>
              <input id={`${tool}-context`} value={context} onChange={(event) => setContext(event.target.value)} placeholder={copy.contextPlaceholder} className={cn(inputClass, "h-11 py-0")} />
            </>
          )}
          {copy.samples && (
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.samples.map((sample) => (
                <button key={sample} type="button" onClick={() => setInput(sample)} className="rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-left text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]">
                  {sample}
                </button>
              ))}
            </div>
          )}
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-[var(--red)]">{error}</p>}
          {limitReached && <UpgradePrompt />}
          {loading ? (
            <Button className="mt-5 w-full" variant="outline" onClick={() => abortRef.current?.abort()}>
              <Square className="h-4 w-4" aria-hidden />{t.stop}
            </Button>
          ) : (
            <Button className="mt-5 w-full" onClick={() => void run()}>
              <Play className="h-4 w-4" aria-hidden />{copy.run}
            </Button>
          )}
        </section>

        <section className="print-area rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6" aria-live="polite" aria-busy={loading}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text-muted)]">{t.deliverable}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{copy.outputLabel}</h2>
            </div>
            <div className="no-print flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={!output || loading} onClick={() => void handleCopy()}>
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}{copied ? t.copied : t.copy}
              </Button>
              <Button size="sm" variant="outline" disabled={!output || loading} onClick={exportWord}>
                <FileDown className="h-4 w-4" aria-hidden />{t.word}
              </Button>
              <Button size="sm" variant="outline" disabled={!output || loading} onClick={() => downloadMarkdown(copy.outputLabel, output)}>
                <FileDown className="h-4 w-4" aria-hidden />{t.markdown}
              </Button>
            </div>
          </div>
          <div className="mt-5 min-h-[520px] rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-5 md:p-6">
            {output ? (
              <>
                <Markdown ref={outputRef}>{output}</Markdown>
                {loading && <span className="mt-2 inline-block h-4 w-2 animate-cursor bg-[var(--accent)] align-middle" aria-hidden />}
              </>
            ) : loading ? (
              <div className="grid min-h-[470px] place-items-center text-center">
                <div>
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-[var(--accent)]" aria-hidden />
                  <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">{t.working}</p>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[470px] place-items-center text-center">
                <div>
                  <Icon className="mx-auto h-8 w-8 text-[var(--text-muted)]" aria-hidden />
                  <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">{t.empty(copy.outputLabel)}</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{t.emptyHint}</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[.07] p-4 text-xs leading-5 text-[var(--text-secondary)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--amber)]" aria-hidden />
            {config.audience === "personal" ? t.disclaimerPersonal : t.disclaimerPro}
          </div>
          {output && !loading && (
            <button onClick={() => { setOutput(""); setError(""); setInput(""); setSecondaryInput(""); setFiles([]); }} className="no-print mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />{t.reset}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
