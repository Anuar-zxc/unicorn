"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FileText, FileUp, Loader2, ShieldCheck, X } from "lucide-react";
import {
  analyzeContractAction,
  type AnalyzeState
} from "@/lib/analysis-action";
import { Button } from "@/components/ui/button";
import { ResponseModeToggle } from "@/components/shared/ResponseModeToggle";
import type { ResponseMode } from "@/lib/ai-prompts";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import type { AILanguage } from "@/lib/ai-language";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

const initialState: AnalyzeState = { ok: false };
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT =
  ".pdf,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,image/heic,image/heif";
const EXTENSIONS = /\.(pdf|docx|jpe?g|png|webp|heic|heif)$/i;

const copy = {
  ru: {
    settings: "Настройки ответа",
    drop: "Перетащите договор сюда",
    or: "или",
    choose: "выберите файл",
    formats: "PDF, DOCX или фото/скан (JPG, PNG, HEIC) · до 10 МБ",
    privacy: "Файл виден только вам. Удалить отчёт можно в истории.",
    remove: "Убрать файл",
    submit: "Проверить договор",
    pending: "Анализируем…",
    tooLarge: "Файл больше 10 МБ. Сожмите PDF или загрузите фото страниц.",
    badType: "Этот формат не поддерживается. Загрузите PDF, DOCX или фото.",
    steps: ["Читаем документ", "Ищем рискованные условия", "Готовим рекомендации"],
    stepsNote: "Обычно это занимает 20–60 секунд. Не закрывайте страницу."
  },
  en: {
    settings: "Answer settings",
    drop: "Drop your contract here",
    or: "or",
    choose: "choose a file",
    formats: "PDF, DOCX or photo/scan (JPG, PNG, HEIC) · up to 10 MB",
    privacy: "Only you can see this file. Delete the report any time from history.",
    remove: "Remove file",
    submit: "Check contract",
    pending: "Analysing…",
    tooLarge: "The file is larger than 10 MB. Compress the PDF or upload photos of the pages.",
    badType: "This format is not supported. Upload a PDF, DOCX or photo.",
    steps: ["Reading the document", "Looking for risky clauses", "Preparing recommendations"],
    stepsNote: "This usually takes 20–60 seconds. Keep this page open."
  }
};

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function UploadContractForm({ disabled }: { disabled?: boolean }) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<ResponseMode>("concise");
  const [language, setLanguage] = useState<AILanguage>(locale);
  const [state, formAction, pending] = useActionState(analyzeContractAction, initialState);

  useEffect(() => {
    if (state.ok && state.analysisId) {
      router.push(`/dashboard/history/${state.analysisId}`);
    }
  }, [router, state]);

  // Staged progress copy while the server action runs (perceived performance).
  useEffect(() => {
    if (!pending) {
      setStep(0);
      return;
    }
    const timers = [setTimeout(() => setStep(1), 6_000), setTimeout(() => setStep(2), 20_000)];
    return () => timers.forEach(clearTimeout);
  }, [pending]);

  function accept(next: File | undefined) {
    if (!next) return;
    if (next.size > MAX_BYTES) {
      setClientError(t.tooLarge);
      return;
    }
    if (!EXTENSIONS.test(next.name)) {
      setClientError(t.badType);
      return;
    }
    setClientError("");
    setFile(next);
    // Keep the real <input> in sync so the server action receives the file.
    if (inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(next);
      inputRef.current.files = transfer.files;
    }
  }

  function clearFile() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const error = clientError || state.error;
  const locked = disabled || pending;

  return (
    <form action={formAction} className="rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)] md:p-8">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="language" value={language} />

      {pending && (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
          <Loader2 className="h-9 w-9 animate-spin text-[var(--accent)]" aria-hidden />
          <ol className="mt-6 space-y-2 text-left text-sm">
            {t.steps.map((label, index) => (
              <li key={label} className={cn("flex items-center gap-2", index > step ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]")}>
                {index < step ? (
                  <Check className="h-4 w-4 text-[var(--green)]" aria-hidden />
                ) : index === step ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" aria-hidden />
                )}
                {label}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-[var(--text-muted)]">{t.stepsNote}</p>
        </div>
      )}
      {/* Kept mounted while pending so the chosen file survives a failed attempt. */}
      <div className={pending ? "hidden" : undefined}>
          <label
            htmlFor="contract-file"
            onDragOver={(event) => {
              event.preventDefault();
              if (!locked) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              if (!locked) accept(event.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150",
              dragging ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--border-strong)] bg-[var(--bg-surface)] hover:border-[var(--accent)]",
              locked && "cursor-not-allowed opacity-60"
            )}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
              <FileUp className="h-7 w-7" aria-hidden />
            </span>
            <span className="mt-5 font-display text-xl font-semibold md:text-2xl">{t.drop}</span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">
              {t.or} <span className="font-semibold text-[var(--accent)] underline underline-offset-2">{t.choose}</span>
            </span>
            <span className="mt-3 text-xs text-[var(--text-muted)]">{t.formats}</span>
          </label>
          <input
            ref={inputRef}
            id="contract-file"
            type="file"
            name="contract"
            accept={ACCEPT}
            className="sr-only"
            disabled={locked}
            aria-describedby={error ? "contract-file-error" : undefined}
            aria-invalid={Boolean(error)}
            onChange={(event) => accept(event.target.files?.[0])}
          />

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                <FileText className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{file.name}</span>
                <span className="text-xs text-[var(--text-muted)]">{formatSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={clearFile}
                aria-label={t.remove}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}

          {error && (
            <p id="contract-file-error" role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-[var(--red)]">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="sr-only">{t.settings}</span>
              <ResponseModeToggle mode={mode} onChange={setMode} />
              <LanguageModeToggle language={language} onChange={setLanguage} />
            </div>
            <Button size="lg" className="w-full md:w-auto" disabled={locked || !file}>
              {t.submit}
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--green)]" aria-hidden />
            {t.privacy}
          </p>
      </div>
    </form>
  );
}
