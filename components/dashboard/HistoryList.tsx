"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Search, Trash2 } from "lucide-react";
import { toolIconFor } from "@/components/dashboard/tool-icons";
import { useLanguage } from "@/components/providers/AppProviders";

type HistoryItem = {
  id: string;
  file_name: string | null;
  title: string | null;
  tool_type: string | null;
  created_at: string;
  result: { summary?: string; overallRisk?: string } | null;
};

export const TOOL_LABELS: Record<string, { ru: string; en: string }> = {
  review: { ru: "Проверка договора", en: "Contract review" },
  analysis: { ru: "Проверка договора", en: "Contract review" },
  check: { ru: "Проверка договора", en: "Contract review" },
  ask: { ru: "Юридический вопрос", en: "Legal question" },
  "seller-tax": { ru: "Налоги продавца", en: "Seller taxes" },
  research: { ru: "Правовой поиск", en: "Legal research" },
  draft: { ru: "Документ", en: "Draft" },
  build: { ru: "Договор", en: "Contract" },
  compare: { ru: "Сравнение версий", en: "Version comparison" },
  client: { ru: "Резюме для клиента", en: "Client summary" },
  case: { ru: "Стратегия по делу", en: "Case strategy" },
  caseprep: { ru: "Подготовка дела", en: "Case prep" }
};

export function itemTitle(item: Pick<HistoryItem, "file_name" | "title" | "tool_type">, ru: boolean) {
  const generic = !item.title || /^[a-z-]+ result$/.test(item.title);
  return (
    item.file_name ||
    (!generic ? item.title : null) ||
    TOOL_LABELS[item.tool_type ?? "review"]?.[ru ? "ru" : "en"] ||
    (ru ? "Отчёт без названия" : "Untitled report")
  );
}

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
  const [filter, setFilter] = useState<"all" | "contracts" | "questions" | "documents">("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ru = locale === "ru";

  async function deleteItem(item: HistoryItem) {
    const confirmed = window.confirm(
      ru
        ? `Удалить «${itemTitle(item, true)}»? Это действие нельзя отменить.`
        : `Delete “${itemTitle(item, false)}”? This cannot be undone.`
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
          {ru ? "Проверьте договор или задайте вопрос — результат сохранится здесь." : "Check a contract or ask a question — results are saved here."}
        </p>
        <Link href="/dashboard" className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
          {ru ? "Проверить договор" : "Analyze a contract"}
        </Link>
      </section>
    );
  }

  const filters = [
    ["all", ru ? "Все" : "All"],
    ["contracts", ru ? "Проверки" : "Reviews"],
    ["questions", ru ? "Вопросы" : "Questions"],
    ["documents", ru ? "Документы" : "Documents"]
  ] as const;
  const groups: Record<string, string[]> = {
    contracts: ["review", "analysis", "check"],
    questions: ["ask", "seller-tax", "research"],
    documents: ["draft", "build", "compare", "client", "case", "caseprep"]
  };
  const needle = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    const type = item.tool_type ?? "review";
    if (filter !== "all" && !groups[filter]?.includes(type)) return false;
    if (!needle) return true;
    return `${itemTitle(item, ru)} ${item.result?.summary ?? ""}`.toLowerCase().includes(needle);
  });

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-[var(--red)]">
          {error}
        </p>
      )}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={ru ? "Фильтр" : "Filter"}>
          {filters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${
                filter === value
                  ? "border-transparent bg-[var(--accent-solid)] text-[var(--on-accent)]"
                  : "border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="relative md:w-72">
          <span className="sr-only">{ru ? "Поиск" : "Search"}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ru ? "Поиск по названию" : "Search by title"}
            className="input-base h-11 pl-10 pr-4"
          />
        </label>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center text-sm text-[var(--text-secondary)]">
          {ru ? "Ничего не найдено. Измените фильтр или запрос." : "Nothing found. Try another filter or query."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2">
          {visible.map((item) => {
            const deleting = deletingId === item.id;
            const Icon = toolIconFor(item.tool_type);
            return (
              <li
                key={item.id}
                className={`group relative flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4 transition-[border-color,box-shadow] duration-150 hover:border-[var(--accent)] hover:shadow-[var(--shadow-sm)] ${
                  deleting ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <Link href={`/dashboard/history/${item.id}`} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-2xl after:content-['']">
                  <h2 className="truncate font-display text-base font-semibold">{itemTitle(item, ru)}</h2>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[var(--text-muted)]">
                    <span>{TOOL_LABELS[item.tool_type ?? "review"]?.[ru ? "ru" : "en"] ?? item.tool_type}</span>
                    <span aria-hidden>·</span>
                    {new Date(item.created_at).toLocaleDateString(ru ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {item.result?.summary && (
                    <p className="mt-1.5 line-clamp-1 text-sm text-[var(--text-secondary)]">{item.result.summary}</p>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => void deleteItem(item)}
                  disabled={deleting}
                  aria-label={`${ru ? "Удалить" : "Delete"}: ${itemTitle(item, ru)}`}
                  className="relative z-10 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-[var(--red)] disabled:cursor-wait"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
