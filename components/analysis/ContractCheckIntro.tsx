"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  personal: {
    en: {
      eyebrow: "Plain-language contract check",
      title: "Know what you are signing.",
      body: "Upload a lease, job offer, service agreement, or any other contract. Lexo highlights costly obligations, unusual clauses, and the questions to ask before signing."
    },
    ru: {
      eyebrow: "Проверка договора простым языком",
      title: "Узнайте, что вы подписываете.",
      body: "Загрузите договор аренды, оффер, договор услуг или любой другой документ. Lexo покажет дорогие обязательства, необычные условия и вопросы, которые стоит задать до подписания."
    }
  },
  professional: {
    en: {
      eyebrow: "Contract intelligence",
      title: "Review PDF, DOCX, scans, and legal photos",
      body: "Upload a client contract or scan. Lexo extracts the text, reads scans with OCR, ranks the risks, drafts replacement language, and saves the report to history."
    },
    ru: {
      eyebrow: "Анализ договоров",
      title: "Проверка PDF, DOCX, сканов и фото документов",
      body: "Загрузите договор клиента или скан. Lexo извлечёт текст, распознает сканы, ранжирует риски, предложит формулировки правок и сохранит отчёт в истории."
    }
  }
};

export function ContractCheckIntro({
  variant,
  used,
  limit,
  allowed
}: {
  variant: "personal" | "professional";
  used: number;
  limit: number;
  allowed: boolean;
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const text = copy[variant][locale];
  const unlimited = !Number.isFinite(limit);
  const percent = unlimited || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));

  return (
    <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--accent)]">{text.eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{text.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{text.body}</p>
      <div className="mt-5 max-w-sm">
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{ru ? "Проверок в этом месяце" : "Checks this month"}</span>
          <span>{unlimited ? (ru ? "без ограничений" : "unlimited") : `${used} / ${limit}`}</span>
        </div>
        {!unlimited && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]" role="progressbar" aria-label={ru ? "Использовано проверок" : "Checks used"} aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit}>
            <div className={`h-full rounded-full ${allowed ? "bg-[var(--accent)]" : "bg-amber-500"}`} style={{ width: `${percent}%` }} />
          </div>
        )}
      </div>
      {!allowed && (
        <p className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/10 p-3 text-sm">
          {ru ? "Лимит проверок на этот месяц исчерпан. " : "You have used this month's checks. "}
          <Link href="/dashboard/billing" className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline">
            {ru ? "Обновить тариф →" : "Upgrade plan →"}
          </Link>
        </p>
      )}
    </section>
  );
}
