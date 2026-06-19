"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  GitCompareArrows,
  MessageCircleQuestion,
  PenLine,
  SearchCheck
} from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";

type RecentItem = {
  id: string;
  file_name: string | null;
  title: string | null;
  type: string | null;
  status: string | null;
  created_at: string;
};

const tools = [
  {
    icon: FileCheck2,
    en: "Contract Review",
    ru: "Проверка договоров",
    descEn: "Analyze PDF, DOCX, scans, and photos",
    descRu: "Анализ PDF, DOCX, сканов и фотографий",
    href: "/dashboard/review",
    tone: "blue"
  },
  {
    icon: SearchCheck,
    en: "Case Research",
    ru: "Правовой поиск",
    descEn: "Statutes, precedents, legal memos",
    descRu: "Законы, судебная практика и правовые заключения",
    href: "/dashboard/research",
    tone: "indigo"
  },
  {
    icon: PenLine,
    en: "Draft Generator",
    ru: "Подготовка документов",
    descEn: "Contracts, motions, demand letters",
    descRu: "Договоры, ходатайства и претензии",
    href: "/dashboard/draft",
    tone: "green"
  },
  {
    icon: BriefcaseBusiness,
    en: "Case Prep",
    ru: "Подготовка дела",
    descEn: "Intake memos and strategy prep",
    descRu: "Вводные меморандумы и стратегия дела",
    href: "/dashboard/caseprep",
    tone: "purple"
  },
  {
    icon: GitCompareArrows,
    en: "Redline Compare",
    ru: "Сравнение версий",
    descEn: "Compare two contract versions",
    descRu: "Сравнение двух версий договора",
    href: "/dashboard/compare",
    tone: "amber"
  },
  {
    icon: MessageCircleQuestion,
    en: "Client Summary",
    ru: "Резюме для клиента",
    descEn: "Plain-language client briefs",
    descRu: "Понятное изложение результатов для клиента",
    href: "/dashboard/client",
    tone: "rose"
  }
];

const toneClasses: Record<string, string> = {
  blue: "border-blue-400/20 bg-blue-400/10 text-blue-400",
  indigo: "border-indigo-400/20 bg-indigo-400/10 text-indigo-400",
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  purple: "border-violet-400/20 bg-violet-400/10 text-violet-400",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-400",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-400"
};

export function DashboardHome({
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
  const pending = recent.filter((item) => item.status === "pending").length;

  return (
    <main className="p-4 md:p-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8">
        <p className="text-sm text-[var(--text-secondary)]">
          {ru ? `Добро пожаловать, ${firstName}.` : `Good morning, ${firstName}.`}
        </p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {ru ? "Юридическая работа — быстрее и точнее." : "Your legal work, accelerated."}
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          {ru
            ? `Документов на проверке: ${pending}.`
            : `You have ${pending} documents pending review.`}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat label={ru ? "Документов за месяц" : "Documents this month"} value={String(reviewed)} />
          <Stat label={ru ? "Сэкономлено времени" : "Hours saved"} value={`${Math.round(reviewed * 1.8)}${ru ? " ч" : "h"}`} />
          <Stat label={ru ? "Активных дел" : "Active matters"} value={String(Math.max(1, Math.ceil(reviewed / 3)))} />
        </div>
      </section>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text-muted)]">
          {ru ? "Рабочее пространство" : "Workspace"}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {ru ? "Выберите инструмент" : "Start with a tool"}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const title = ru ? tool.ru : tool.en;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneClasses[tool.tone]}`}>
                    <tool.icon className="h-5 w-5" strokeWidth={2.65} />
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
                    {ru ? "Работает" : "Works now"}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {ru ? tool.descRu : tool.descEn}
                </p>
                <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  {ru ? "Открыть" : "Run tool"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text-muted)]">
              {ru ? "Недавняя работа" : "Recent work"}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold">
              {ru ? "Активность по делам" : "Matter activity"}
            </h2>
          </div>
          <Link href="/dashboard/docs" className="text-sm font-semibold text-[var(--accent)]">
            {ru ? "Смотреть все" : "View all"}
          </Link>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs uppercase tracking-[.1em] text-[var(--text-muted)]">
              <tr>
                <th className="pb-3 font-medium">{ru ? "Файл" : "File name"}</th>
                <th className="pb-3 font-medium">{ru ? "Инструмент" : "Tool used"}</th>
                <th className="pb-3 font-medium">{ru ? "Дата" : "Date"}</th>
                <th className="pb-3 font-medium">{ru ? "Статус" : "Status"}</th>
                <th className="pb-3 text-right font-medium">{ru ? "Действия" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recent.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 font-medium">{item.file_name || item.title || (ru ? "Без названия" : "Untitled matter")}</td>
                  <td className="py-4 text-[var(--text-secondary)]">{toolLabel(item.type, ru)}</td>
                  <td className="py-4 text-[var(--text-secondary)]">
                    {new Date(item.created_at).toLocaleDateString(ru ? "ru-RU" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                      {item.status === "pending" ? (ru ? "В обработке" : "Pending") : (ru ? "Готово" : "Complete")}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/dashboard/history/${item.id}`} className="font-medium text-[var(--accent)]">
                      {ru ? "Открыть" : "Open"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recent.length && (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">
              {ru ? "Работ пока нет. Выберите инструмент выше, чтобы начать." : "No work yet. Choose a tool above to start your first matter."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

function toolLabel(type: string | null, ru: boolean) {
  const labels: Record<string, [string, string]> = {
    analyze: ["Contract Review", "Проверка договоров"],
    review: ["Contract Review", "Проверка договоров"],
    build: ["Draft Generator", "Подготовка документов"],
    draft: ["Draft Generator", "Подготовка документов"],
    case: ["Case Prep", "Подготовка дела"],
    caseprep: ["Case Prep", "Подготовка дела"],
    research: ["Case Research", "Правовой поиск"],
    compare: ["Redline Compare", "Сравнение версий"],
    client: ["Client Summary", "Резюме для клиента"]
  };
  const label = labels[type ?? ""];
  return label ? label[ru ? 1 : 0] : (ru ? "Юридический AI" : "Legal AI");
}
