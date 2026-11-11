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

// 700 in light / 300 in dark keeps icons above 3:1 on their tinted chips.
const toneClasses: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  purple: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300"
};

export function DashboardHome({
  firstName,
  reviewed,
  recent,
  usage = []
}: {
  firstName: string;
  reviewed: number;
  recent: RecentItem[];
  usage?: { label: "analyses" | "builds" | "questions"; used: number; limit: number }[];
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const usageLabel = {
    analyses: ru ? "Проверок в этом месяце" : "Reviews this month",
    builds: ru ? "Документов в этом месяце" : "Drafts this month",
    questions: ru ? "Вопросов в этом месяце" : "Questions this month"
  };
  const formatUsage = (used: number, limit: number) =>
    Number.isFinite(limit) ? `${used} / ${limit}` : String(used);

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8">
        <p className="text-sm text-[var(--text-secondary)]">
          {ru ? (firstName ? `Добро пожаловать, ${firstName}` : "Добро пожаловать") : firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </p>
        <h1 className="mt-1 max-w-3xl font-display text-3xl font-bold tracking-tight md:text-4xl">
          {ru ? "Юридическая работа — быстрее и точнее." : "Your legal work, accelerated."}
        </h1>
        <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={ru ? "Всего документов" : "Documents total"} value={String(reviewed)} />
          {usage.map((row) => (
            <Stat key={row.label} label={usageLabel[row.label]} value={formatUsage(row.used, row.limit)} />
          ))}
        </dl>
      </section>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text-muted)]">
          {ru ? "Рабочее пространство" : "Workspace"}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {ru ? "Выберите инструмент" : "Start with a tool"}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const title = ru ? tool.ru : tool.en;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[tool.tone]}`}>
                  <tool.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {ru ? tool.descRu : tool.descEn}
                </p>
                <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  {ru ? "Открыть" : "Run tool"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-5 md:p-6">
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
                <tr key={item.id} className="transition-colors hover:bg-[var(--bg-surface)]">
                  <td className="max-w-[320px] truncate py-4 font-medium">{item.file_name || item.title || (ru ? "Без названия" : "Untitled matter")}</td>
                  <td className="py-4 text-[var(--text-secondary)]">{toolLabel(item.type, ru)}</td>
                  <td className="py-4 text-[var(--text-secondary)]">
                    {new Date(item.created_at).toLocaleDateString(ru ? "ru-RU" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
      <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</dd>
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
    client: ["Client Summary", "Резюме для клиента"],
    ask: ["Legal question", "Юридический вопрос"],
    "seller-tax": ["Seller taxes", "Налоги продавца"]
  };
  const label = labels[type ?? ""];
  return label ? label[ru ? 1 : 0] : (ru ? "Юридический AI" : "Legal AI");
}
