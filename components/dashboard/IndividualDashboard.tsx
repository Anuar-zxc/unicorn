"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FileUp,
  FolderOpen,
  MessageCircleQuestion,
  PenLine,
  ReceiptText
} from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";
import { TOOL_LABELS } from "@/components/dashboard/HistoryList";
import { toolIconFor } from "@/components/dashboard/tool-icons";

type RecentItem = {
  id: string;
  file_name: string | null;
  title: string | null;
  type?: string | null;
  created_at: string;
};

export type HomeUsage = { label: "analyses" | "builds" | "questions"; used: number; limit: number };

const secondaryTools = [
  {
    href: "/dashboard/ask",
    icon: MessageCircleQuestion,
    ru: ["Задать вопрос", "Права арендатора, работника, покупателя или фрилансера — простым языком."],
    en: ["Ask a question", "Your rights as a tenant, employee, customer, or freelancer — in plain language."],
    tone: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300"
  },
  {
    href: "/dashboard/build",
    icon: PenLine,
    ru: ["Создать договор", "Аренда, услуги, заём, купля-продажа — по шагам за несколько минут."],
    en: ["Build a contract", "Rental, services, loan, sale — step by step in a few minutes."],
    tone: "text-violet-700 bg-violet-500/10 dark:text-violet-300"
  },
  {
    href: "/dashboard/seller-tax",
    icon: ReceiptText,
    ru: ["Налоги продавца", "Kaspi, Wildberries, OZON: ИП, режим налогообложения и отчётность."],
    en: ["Seller taxes", "Kaspi, Wildberries, OZON: registration, tax regime and reporting."],
    tone: "text-amber-700 bg-amber-500/10 dark:text-amber-300"
  }
];

const usageLabels = {
  ru: { analyses: "Проверки договоров", builds: "Договоры", questions: "Вопросы" },
  en: { analyses: "Contract checks", builds: "Contracts", questions: "Questions" }
};

export function IndividualDashboard({
  firstName,
  recent,
  usage = []
}: {
  firstName: string;
  reviewed?: number;
  recent: RecentItem[];
  usage?: HomeUsage[];
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const dateFormat = new Intl.DateTimeFormat(ru ? "ru-RU" : "en-US", { day: "numeric", month: "short" });

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <p className="text-sm text-[var(--text-secondary)]">{ru ? (firstName ? `Здравствуйте, ${firstName}` : "Здравствуйте") : firstName ? `Hi, ${firstName}` : "Hi there"}</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
        {ru ? "С чем помочь сегодня?" : "What can Lexo help with today?"}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Link
          href="/dashboard/check"
          className="group relative overflow-hidden rounded-3xl border border-[var(--accent)]/25 bg-[var(--accent-light)] p-6 transition-shadow duration-200 hover:shadow-[var(--shadow-lg)] md:p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-solid)] text-[var(--on-accent)]">
            <FileCheck2 className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-6 font-display text-2xl font-bold md:text-3xl">
            {ru ? "Проверить договор до подписания" : "Check a contract before signing"}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)] md:text-base md:leading-7">
            {ru
              ? "Загрузите договор или фото — Lexo покажет рискованные условия, объяснит их простым языком и предложит правки."
              : "Upload a contract or photo — Lexo flags risky clauses, explains them in plain language, and suggests edits."}
          </p>
          <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent-solid)] px-5 text-sm font-semibold text-[var(--on-accent)] transition-colors group-hover:bg-[var(--accent-solid-hover)]">
            <FileUp className="h-4 w-4" aria-hidden />
            {ru ? "Загрузить документ" : "Upload a document"}
          </span>
          <p className="mt-3 text-xs text-[var(--text-muted)]">PDF · DOCX · JPG · PNG · ≤ 10 MB</p>
        </Link>

        <div className="grid grid-cols-1 gap-3">
          {secondaryTools.map((tool) => {
            const Icon = tool.icon;
            const [title, description] = tool[locale];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4 transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)] md:p-5"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tool.tone}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-display text-base font-semibold">
                    {title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">{description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">{ru ? "Недавние документы" : "Recent documents"}</h2>
            <Link href="/dashboard/history" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              {ru ? "Все" : "View all"}
            </Link>
          </div>
          {recent.length ? (
            <ul className="mt-4 divide-y divide-[var(--border)]">
              {recent.slice(0, 5).map((item) => {
                const Icon = toolIconFor(item.type);
                return (
                  <li key={item.id}>
                    <Link href={`/dashboard/history/${item.id}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-[var(--bg-surface)]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.file_name || item.title || (ru ? "Без названия" : "Untitled")}</span>
                        <span className="text-xs text-[var(--text-muted)]">{TOOL_LABELS[item.type ?? "review"]?.[locale] ?? item.type}</span>
                      </span>
                      <span className="shrink-0 text-xs text-[var(--text-muted)]">{dateFormat.format(new Date(item.created_at))}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-[var(--border-strong)] px-6 py-10 text-center">
              <FolderOpen className="h-7 w-7 text-[var(--text-muted)]" aria-hidden />
              <p className="mt-3 text-sm font-medium">{ru ? "Здесь появятся ваши проверки и ответы" : "Your checks and answers will appear here"}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{ru ? "Начните с проверки договора — это займёт около минуты." : "Start with a contract check — it takes about a minute."}</p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">{ru ? "Лимиты месяца" : "This month"}</h2>
            <Link href="/dashboard/billing" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              {ru ? "Тарифы" : "Plans"}
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {usage.map((row) => {
              const unlimited = !Number.isFinite(row.limit);
              const left = unlimited ? null : Math.max(0, row.limit - row.used);
              const percent = unlimited || row.limit === 0 ? 0 : Math.min(100, Math.round((row.used / row.limit) * 100));
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span>{usageLabels[locale][row.label]}</span>
                    <span className="text-[var(--text-muted)]">
                      {unlimited ? (ru ? "без ограничений" : "unlimited") : ru ? `осталось ${left} из ${row.limit}` : `${left} of ${row.limit} left`}
                    </span>
                  </div>
                  {!unlimited && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div className={`h-full rounded-full ${percent >= 100 ? "bg-amber-500" : "bg-[var(--accent-solid)]"}`} style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-xs leading-5 text-[var(--text-muted)]">
            {ru
              ? "Lexo даёт правовую информацию, а не консультацию. Для важных решений проверьте выводы с юристом."
              : "Lexo provides legal information, not legal advice. Confirm important decisions with a lawyer."}
          </p>
        </section>
      </div>
    </main>
  );
}
