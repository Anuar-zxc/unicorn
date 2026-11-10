"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, Copy, FileDown, FilePlus, MessageCircleQuestion, Printer } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysis-action";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import { copyToClipboard, downloadWord } from "@/lib/export";
import { cn } from "@/lib/utils";

type Level = "High" | "Medium" | "Low";

const riskTone: Record<Level, string> = {
  High: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-100",
  Low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-100"
};

const copy = {
  ru: {
    level: { High: "Высокий", Medium: "Средний", Low: "Низкий" } as Record<Level, string>,
    risk: "риск",
    summary: "Краткий вывод",
    summaryTitle: "Что это за документ и стоит ли подписывать",
    jurisdiction: "Применимое право",
    notDetected: "Не определено — уточните оговорку о применимом праве.",
    clauses: "Ключевые условия",
    clausesTitle: "Что нужно понимать в этом договоре",
    breakdown: "Разбор рисков",
    breakdownTitle: "Условия, на которые стоит обратить внимание",
    columns: ["Условие", "Что это значит", "Риск", "Что предложить"],
    fullText: "Текст условия",
    noClause: "Текст условия не извлечён — для сканов загрузите более чёткое фото.",
    playbook: "Переговоры",
    playbookTitle: "Формулировки, которые можно предложить",
    current: "Сейчас",
    replacement: "Предлагаемая редакция",
    copy: "Копировать",
    copied: "Скопировано",
    questions: "Вопросы юристу",
    questionsTitle: "Что спросить, чтобы консультация была короче",
    word: "Скачать Word",
    print: "Печать / PDF",
    build: "Подготовить свою редакцию",
    ask: "Задать вопрос по договору",
    reportTitle: "Отчёт о проверке договора"
  },
  en: {
    level: { High: "High", Medium: "Medium", Low: "Low" } as Record<Level, string>,
    risk: "risk",
    summary: "Summary",
    summaryTitle: "What this document is and whether to sign",
    jurisdiction: "Governing law",
    notDetected: "Not detected — confirm the governing law clause.",
    clauses: "Key terms",
    clausesTitle: "What you need to understand in this contract",
    breakdown: "Risk breakdown",
    breakdownTitle: "Clauses that deserve attention",
    columns: ["Clause", "What it means", "Risk", "What to ask for"],
    fullText: "Clause text",
    noClause: "Clause text was not extracted — for scans, upload a sharper photo.",
    playbook: "Negotiation",
    playbookTitle: "Wording you can propose",
    current: "Current",
    replacement: "Suggested replacement",
    copy: "Copy",
    copied: "Copied",
    questions: "Questions for a lawyer",
    questionsTitle: "Ask these to keep the consultation short",
    word: "Download Word",
    print: "Print / PDF",
    build: "Draft my own version",
    ask: "Ask about this contract",
    reportTitle: "Contract review report"
  }
};

function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyToClipboard(text)) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }
      }}
      className="no-print mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-200"
    >
      {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      {copied ? done : label}
    </button>
  );
}

export function AnalysisCards({ result, title }: { result: AnalysisResult; title?: string }) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const reportRef = useRef<HTMLDivElement>(null);
  const risks = result.risks ?? [];
  const overallRisk: Level =
    result.overallRisk ??
    (risks.some((risk) => risk.level === "High") ? "High" : risks.some((risk) => risk.level === "Medium") ? "Medium" : "Low");
  const negotiationRisks = risks.filter((risk) => risk.level !== "Low");
  const card = "rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6";
  const eyebrow = "text-xs font-semibold uppercase tracking-[.14em] text-[var(--text-muted)]";
  const heading = "mt-2 font-display text-2xl font-bold";

  return (
    <div className="pb-28">
      <div ref={reportRef} className="space-y-5">
        <section className={card}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className={eyebrow}>{t.summary}</p>
              <h2 className={heading}>{t.summaryTitle}</h2>
            </div>
            <span className={cn("w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide", riskTone[overallRisk])}>
              {t.level[overallRisk]} {t.risk}
            </span>
          </div>
          <p className="mt-5 text-lg leading-8">{result.summary}</p>
          <p className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-4 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{t.jurisdiction}:</span>{" "}
            {result.jurisdiction || t.notDetected}
          </p>
        </section>

        {result.importantClauses?.length > 0 && (
          <section className={card}>
            <p className={eyebrow}>{t.clauses}</p>
            <h2 className={heading}>{t.clausesTitle}</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6 md:grid-cols-2">
              {result.importantClauses.map((clause) => (
                <li key={clause} className="flex gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                  {clause}
                </li>
              ))}
            </ul>
          </section>
        )}

        {risks.length > 0 && (
          <section className={card}>
            <p className={eyebrow}>{t.breakdown}</p>
            <h2 className={heading}>{t.breakdownTitle}</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-page)]">
              <div className="hidden grid-cols-[1fr_1.4fr_120px_1.4fr] gap-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] md:grid">
                {t.columns.map((column) => <span key={column}>{column}</span>)}
              </div>
              {risks.map((risk) => (
                <details key={risk.title} className="group border-b border-[var(--border)] last:border-0">
                  <summary className="grid cursor-pointer gap-3 px-4 py-4 text-sm hover:bg-[var(--bg-surface)] md:grid-cols-[1fr_1.4fr_120px_1.4fr]">
                    <span className="font-semibold">{risk.title}</span>
                    <span className="text-[var(--text-secondary)]">{risk.explanation}</span>
                    <span>
                      <span className={cn("rounded-full border px-2 py-1 text-xs font-bold", riskTone[risk.level])}>{t.level[risk.level]}</span>
                    </span>
                    <span className="text-[var(--text-secondary)]">{risk.recommendation}</span>
                  </summary>
                  <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{t.fullText}</p>
                    <blockquote className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm leading-6">
                      {risk.clauseText || t.noClause}
                    </blockquote>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {negotiationRisks.length > 0 && (
          <section className={card}>
            <p className={eyebrow}>{t.playbook}</p>
            <h2 className={heading}>{t.playbookTitle}</h2>
            <div className="mt-5 grid gap-4">
              {negotiationRisks.map((risk) => {
                const replacement = risk.replacementLanguage || risk.recommendation;
                return (
                  <article key={risk.title} className="rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <h3 className="font-display text-lg font-bold">{risk.title}</h3>
                      <span className={cn("w-fit rounded-full border px-2 py-1 text-xs font-bold", riskTone[risk.level])}>{t.level[risk.level]}</span>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-300">{t.current}</p>
                        <p className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm leading-6">
                          {risk.clauseText || risk.explanation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{t.replacement}</p>
                        <div className="mt-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 text-sm leading-6">
                          <p>{replacement}</p>
                          <CopyButton text={replacement} label={t.copy} done={t.copied} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {result.lawyerQuestions?.length > 0 && (
          <section className={card}>
            <p className={eyebrow}>{t.questions}</p>
            <h2 className={heading}>{t.questionsTitle}</h2>
            <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-6 text-[var(--text-secondary)] md:grid-cols-2">
              {result.lawyerQuestions.map((question) => (
                <li key={question} className="rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
                  {question}
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6">{result.disclaimer}</p>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--bg-page)]/92 px-4 py-3 backdrop-blur-xl lg:left-[var(--sidebar-width,15rem)]">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto [scrollbar-width:none] md:flex-wrap [&>*]:shrink-0">
          <Button size="sm" variant="outline" onClick={() => downloadWord(title || t.reportTitle, reportRef.current?.innerHTML ?? "")}>
            <FileDown className="h-4 w-4" aria-hidden />{t.word}
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden />{t.print}
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/build"><FilePlus className="h-4 w-4" aria-hidden />{t.build}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/ask"><MessageCircleQuestion className="h-4 w-4" aria-hidden />{t.ask}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
