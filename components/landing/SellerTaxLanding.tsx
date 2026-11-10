"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ReceiptText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  ru: {
    badge: "Налоговый помощник для продавцов в Казахстане",
    title: "Продаёте на Kaspi или Wildberries?",
    accent: "Узнайте свои налоговые шаги.",
    lead: "Правила для онлайн-продавцов в Казахстане меняются. Получите персональный разбор: регистрация, режим налогообложения, отчётность и что проверить — примерно за минуту.",
    cta: "Проверить мой статус бесплатно",
    reportTitle: "В отчёте",
    items: [
      "Нужна ли регистрация ИП",
      "Подходящий режим налогообложения и отчётность",
      "Пороги по НДС и обороту — с пометкой, что проверить",
      "Особенности продаж через зарубежные маркетплейсы",
      "Практический чек-лист документов и действий"
    ],
    note: "Налоговые правила меняются. Lexo подсказывает, что проверить, и ссылается на kgd.gov.kz — окончательное решение лучше согласовать с бухгалтером."
  },
  en: {
    badge: "Kazakhstan seller tax assistant",
    title: "Selling on Kaspi or Wildberries?",
    accent: "Know your tax steps.",
    lead: "Kazakhstan rules for online sellers are changing. Get a personalised breakdown of registration, tax regime, reporting, and what to verify — in about a minute.",
    cta: "Check my tax status — free",
    reportTitle: "Your report covers",
    items: [
      "Whether ИП (sole proprietor) registration may be required",
      "Likely tax regime and reporting",
      "VAT and turnover thresholds — flagged for verification",
      "Cross-border marketplace considerations",
      "A practical document and action checklist"
    ],
    note: "Tax rules change. Lexo shows what to verify and points to kgd.gov.kz — confirm the final decision with an accountant."
  }
};

export function SellerTaxLanding() {
  const { locale } = useLanguage();
  const t = copy[locale];
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="relative overflow-hidden border-b border-[var(--border)] pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
          <div className="container-shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
                <ReceiptText className="h-4 w-4" aria-hidden />
                {t.badge}
              </span>
              <h1 className="mt-7 font-display text-[clamp(38px,5.4vw,66px)] font-bold leading-[1.04] tracking-[-0.045em]">
                {t.title}
                <span className="block text-[var(--accent)]">{t.accent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">{t.lead}</p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/auth/signup?account=individual&next=/dashboard/seller-tax">
                  {t.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-lg)]">
              <h2 className="font-display text-2xl font-semibold">{t.reportTitle}</h2>
              <ul className="mt-6 space-y-4">
                {t.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--text-muted)]">{t.note}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
