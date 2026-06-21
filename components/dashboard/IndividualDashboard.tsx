"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  MessageCircleQuestion,
  PenLine,
  ReceiptText
} from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";

type RecentItem = {
  id: string;
  file_name: string | null;
  title: string | null;
  created_at: string;
};

const tools = [
  {
    href: "/dashboard/build",
    icon: PenLine,
    titleEn: "Build an agreement",
    titleRu: "Создать договор",
    descEn: "Answer a few simple questions and get a rental, freelance, loan, sale, or other agreement.",
    descRu: "Ответьте на несколько простых вопросов и получите договор аренды, услуг, займа, купли-продажи или другое соглашение.",
    tone: "text-violet-400 bg-violet-400/10 border-violet-400/20"
  },
  {
    href: "/dashboard/check",
    icon: FileCheck2,
    titleEn: "Check my contract",
    titleRu: "Проверить мой договор",
    descEn: "Upload a lease, job offer, freelance agreement, or any contract and get a plain-English risk check.",
    descRu: "Загрузите аренду, оффер, договор с заказчиком или другой документ и получите понятный разбор рисков.",
    tone: "text-blue-400 bg-blue-400/10 border-blue-400/20"
  },
  {
    href: "/dashboard/ask",
    icon: MessageCircleQuestion,
    titleEn: "Ask a legal question",
    titleRu: "Задать юридический вопрос",
    descEn: "Get a clear answer about your rights as a tenant, employee, customer, or freelancer.",
    descRu: "Получите понятный ответ о правах арендатора, работника, покупателя или фрилансера.",
    tone: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  },
  {
    href: "/dashboard/seller-tax",
    icon: ReceiptText,
    titleEn: "Marketplace seller taxes",
    titleRu: "Налоги продавца на маркетплейсе",
    descEn: "Selling on Kaspi, Wildberries, OZON, or Instagram? See what Kazakhstan tax steps may apply.",
    descRu: "Продаёте на Kaspi, Wildberries, OZON или Instagram? Узнайте, какие налоговые шаги могут потребоваться.",
    tone: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    badge: "New"
  }
];

export function IndividualDashboard({
  firstName,
  reviewed,
  recent
}: {
  firstName: string;
  reviewed: number;
  recent: RecentItem[];
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8">
        <p className="text-sm text-[var(--text-secondary)]">
          {ru ? `Привет, ${firstName} 👋` : `Hi, ${firstName} 👋`}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {ru ? "С чем помочь сегодня?" : "What do you need help with?"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          {ru
            ? "Lexo объясняет договоры и юридические вопросы простым языком. Для важных решений всегда перепроверяйте выводы со специалистом."
            : "Lexo explains contracts and legal questions in plain language. For important decisions, confirm the result with a qualified professional."}
        </p>
      </section>

      <section className="mt-6 grid gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            <div className="flex items-start gap-4">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${tool.tone}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-semibold">
                    {ru ? tool.titleRu : tool.titleEn}
                  </h2>
                  {tool.badge && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {ru ? tool.descRu : tool.descEn}
                </p>
                <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  {ru ? "Открыть" : "Open"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.16em] text-[var(--text-muted)]">
              {ru ? "Ваши документы" : "Your documents"}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold">
              {ru ? `${reviewed} проверено` : `${reviewed} checked`}
            </h2>
          </div>
          <Link href="/dashboard/docs" className="text-sm font-semibold text-[var(--accent)]">
            {ru ? "Все документы" : "View all"}
          </Link>
        </div>
        {!recent.length ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">
            {ru ? "Пока документов нет." : "No documents yet."}
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {recent.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/history/${item.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm hover:border-[var(--accent)]"
              >
                <span className="truncate font-medium">{item.file_name || item.title || (ru ? "Документ" : "Document")}</span>
                <span className="ml-4 shrink-0 text-xs text-[var(--text-muted)]">
                  {new Date(item.created_at).toLocaleDateString(ru ? "ru-RU" : "en-US")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
