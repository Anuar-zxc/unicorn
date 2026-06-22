"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";

type HistoryItem = {
  id: string;
  file_name: string | null;
  created_at: string;
  result: { summary?: string } | null;
};

export function HistoryHeading() {
  const { locale } = useLanguage();
  return (
    <div className="mb-6">
      <p className="text-sm text-[var(--text-muted)]">
        {locale === "ru" ? "Сохранённые отчёты" : "Saved reports"}
      </p>
      <h1 className="font-display text-3xl font-semibold">
        {locale === "ru" ? "История анализов" : "Previous Analyses"}
      </h1>
    </div>
  );
}

export function HistoryList({ initialItems }: { initialItems: HistoryItem[] }) {
  const { locale } = useLanguage();
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ru = locale === "ru";

  async function deleteItem(item: HistoryItem) {
    const confirmed = window.confirm(
      ru
        ? `Удалить отчёт «${item.file_name || "Без названия"}»? Это действие нельзя отменить.`
        : `Delete “${item.file_name || "Untitled report"}”? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/analyses/${item.id}`, {
        method: "DELETE"
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        throw new Error(payload?.error || (ru ? "Не удалось удалить отчёт." : "Could not delete the report."));
      }
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : ru ? "Не удалось удалить отчёт." : "Could not delete the report.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!items.length) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">
          {ru ? "Сохранённых отчётов пока нет" : "No reports yet"}
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          {ru ? "Загрузите первый договор, чтобы создать отчёт." : "Upload your first contract to create a report."}
        </p>
        <Link href="/dashboard/analyze" className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
          {ru ? "Проверить договор" : "Analyze a contract"}
        </Link>
      </section>
    );
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="grid gap-3">
        {items.map((item) => {
          const deleting = deletingId === item.id;
          return (
            <article
              key={item.id}
              className={`flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition md:flex-row md:items-center md:justify-between ${
                deleting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Link href={`/dashboard/history/${item.id}`} className="min-w-0 flex-1">
                <h2 className="truncate font-display text-xl font-semibold">
                  {item.file_name || (ru ? "Отчёт без названия" : "Untitled report")}
                </h2>
                <p className="mt-2 line-clamp-1 text-sm text-[var(--text-secondary)]">
                  {item.result?.summary ?? (ru ? "Отчёт о рисках договора" : "Contract risk report")}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {new Date(item.created_at).toLocaleDateString(ru ? "ru-RU" : "en-US")}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => void deleteItem(item)}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-wait"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? (ru ? "Удаление…" : "Deleting…") : (ru ? "Удалить" : "Delete")}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
