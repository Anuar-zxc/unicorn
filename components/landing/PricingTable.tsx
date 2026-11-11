"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/AppProviders";
import { SALES_EMAIL } from "@/lib/site";

const plansEn = [
  {
    name: "Solo",
    price: { monthly: 19, annual: 15 },
    description: "For independent professionals and solo lawyers.",
    features: ["All 6 AI tools", "50 documents/month", "Contract review up to 100 pages", "Case research memos", "Document drafting", "PDF & DOCX export", "14-day document history", "Email support"]
  },
  {
    name: "Firm",
    price: { monthly: 59, annual: 47 },
    description: "For small law firms and legal teams.",
    badge: "Most popular",
    highlight: true,
    features: ["Everything in Solo", "Up to 5 team members", "250 documents/month", "Contract review up to 500 pages", "Shared document workspace", "Matter/case organization", "Client brief portal", "Priority AI processing", "90-day document history", "Priority support"]
  },
  {
    name: "Enterprise",
    price: { monthly: 149, annual: 119 },
    description: "For larger firms and in-house legal departments.",
    badge: "Full power",
    features: ["Everything in Firm", "Unlimited team members", "Custom practice-area prompts", "API access", "SSO / SAML authentication", "Custom retention policy", "Dedicated account manager", "SLA guarantee", "On-premise deployment option", "Custom contract templates"]
  }
];
const plansRu = [
  { name: "Solo", price: { monthly: 19, annual: 15 }, description: "Для независимых специалистов и частных юристов.", features: ["Все 6 AI-инструментов", "50 документов в месяц", "Проверка до 100 страниц", "Исследовательские меморандумы", "Создание документов", "Экспорт PDF и DOCX", "История 14 дней", "Поддержка по email"] },
  { name: "Firm", price: { monthly: 59, annual: 47 }, description: "Для небольших юридических фирм и команд.", badge: "Популярный", highlight: true, features: ["Всё из Solo", "До 5 участников", "250 документов в месяц", "Проверка до 500 страниц", "Общее рабочее пространство", "Организация дел", "Портал клиентских резюме", "Приоритетная обработка", "История 90 дней", "Приоритетная поддержка"] },
  { name: "Enterprise", price: { monthly: 149, annual: 119 }, description: "Для крупных фирм и юридических департаментов.", badge: "Полная мощность", features: ["Всё из Firm", "Неограниченная команда", "Настраиваемые AI-промпты", "API-доступ", "SSO / SAML", "Политика хранения данных", "Персональный менеджер", "SLA", "Локальное развёртывание", "Шаблоны договоров"] }
];

const individualPlans = {
  en: [
    {
      name: "Free",
      price: 0,
      description: "For occasional questions and a first contract check.",
      features: ["1 contract check/month", "1 contract build/month", "5 legal questions or seller tax checks/month", "References to Kazakhstan law"]
    },
    {
      name: "Plus",
      price: 9,
      description: "For freelancers, tenants, employees, and active marketplace sellers.",
      badge: "Best value",
      highlight: true,
      features: ["20 contract checks/month", "50 legal questions/month", "Full seller tax reports", "Document history", "Detailed response mode"]
    }
  ],
  ru: [
    {
      name: "Free",
      price: 0,
      description: "Для редких вопросов и первой проверки договора.",
      features: ["1 проверка договора в месяц", "1 договор из конструктора в месяц", "5 вопросов или налоговых проверок в месяц", "Ссылки на законы РК"]
    },
    {
      name: "Plus",
      price: 9,
      description: "Для фрилансеров, арендаторов, работников и активных продавцов.",
      badge: "Выгодно",
      highlight: true,
      features: ["20 проверок договоров в месяц", "50 юридических вопросов в месяц", "Полные налоговые отчёты", "История документов", "Подробный режим ответа"]
    }
  ]
};

export function PricingTable() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const plans = ru ? plansRu : plansEn;
  const [audience, setAudience] = useState<"lawyer" | "individual">("individual");
  const annualAvailable = Boolean(
    process.env.NEXT_PUBLIC_POLAR_SOLO_ANNUAL_PRODUCT_ID &&
      process.env.NEXT_PUBLIC_POLAR_FIRM_ANNUAL_PRODUCT_ID
  );
  const [annual, setAnnual] = useState(false);
  const tabs = [
    ["individual", ru ? "Для частных лиц" : "For individuals"],
    ["lawyer", ru ? "Для юристов" : "For lawyers"]
  ] as const;

  return (
    <section id="pricing" className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{ru ? "Тарифы" : "Pricing"}</p>
          <h2 className="mt-3 font-display text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">
            {ru ? "Начните бесплатно. Платите, когда Lexo станет частью работы." : "Start free. Pay when Lexo becomes part of your work."}
          </h2>
          <div role="tablist" aria-label={ru ? "Тип тарифа" : "Plan type"} className="mt-8 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-page)] p-1 shadow-[var(--shadow-sm)]">
            {tabs.map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={audience === value}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold text-[var(--text-secondary)] transition",
                  audience === value && "bg-[var(--accent-solid)] text-[var(--on-accent)]"
                )}
                onClick={() => {
                  setAudience(value);
                  if (value === "individual") setAnnual(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {audience === "lawyer" && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <button className={cn("font-semibold", annual ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]")} onClick={() => setAnnual(false)}>
                {ru ? "Ежемесячно" : "Monthly"}
              </button>
              <span className="h-4 w-px bg-[var(--border-strong)]" aria-hidden />
              <button
                className={cn("font-semibold", annual ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]", !annualAvailable && "cursor-not-allowed opacity-60")}
                onClick={() => annualAvailable && setAnnual(true)}
                disabled={!annualAvailable}
              >
                {annualAvailable ? (ru ? "Ежегодно · −20%" : "Annual · save 20%") : (ru ? "Ежегодно · скоро" : "Annual · coming soon")}
              </button>
            </div>
          )}
        </div>

        {audience === "individual" ? (
          <div className="mx-auto mt-10 grid grid-cols-1 max-w-4xl gap-5 md:grid-cols-2">
            {individualPlans[locale].map((plan) => {
              const comingSoon = plan.price > 0;
              return (
                <article
                  key={plan.name}
                  className={cn(
                    "relative rounded-xl border bg-[var(--bg-page)] p-7",
                    plan.highlight ? "border-[var(--accent)] shadow-[var(--shadow-lg)]" : "border-[var(--border)]"
                  )}
                >
                  {(comingSoon || plan.badge) && (
                    <span className="absolute right-5 top-5 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                      {comingSoon ? (ru ? "Скоро" : "Coming soon") : plan.badge}
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-display text-5xl font-semibold">${plan.price}</span>
                    <span className="pb-2 text-sm text-[var(--text-secondary)]">{ru ? "/месяц" : "/month"}</span>
                  </div>
                  <Button asChild className="mt-6 w-full" variant={comingSoon ? "outline" : "primary"}>
                    <Link href="/auth/signup?account=individual">
                      {comingSoon ? (ru ? "Начать с бесплатного" : "Start on Free") : (ru ? "Начать бесплатно" : "Get started")}
                    </Link>
                  </Button>
                  <ul className="mt-7 space-y-3 text-sm text-[var(--text-secondary)]">
                    {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-[var(--green)]" aria-hidden /><span>{feature}</span></li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const enterprise = plan.name === "Enterprise";
                const href = enterprise
                  ? `mailto:${SALES_EMAIL}?subject=Lexo%20Enterprise`
                  : `/api/checkout?plan=${plan.name === "Solo" ? "solo" : "firm"}&billing=${annual && annualAvailable ? "annual" : "monthly"}`;
                return (
                  <article key={plan.name} className={cn("relative rounded-xl border bg-[var(--bg-page)] p-7", plan.highlight ? "border-[var(--accent)] shadow-[var(--shadow-lg)]" : "border-[var(--border)]")}>
                    {plan.badge && <span className="absolute right-5 top-5 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">{plan.badge}</span>}
                    <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
                    <div className="mt-6 flex items-end gap-1">
                      <span className="font-display text-5xl font-semibold">${annual ? plan.price.annual : plan.price.monthly}</span>
                      <span className="pb-2 text-sm text-[var(--text-secondary)]">{ru ? "/месяц" : "/month"}</span>
                    </div>
                    {annual && <p className="mt-2 text-xs text-[var(--text-muted)]">{ru ? "Оплата за год" : "Billed annually"}</p>}
                    <Button asChild className="mt-6 w-full" variant={plan.highlight ? "primary" : "outline"}>
                      {/* Plain <a>: checkout is a route handler and needs a full navigation. */}
                      <a href={href}>
                        {enterprise ? (ru ? "Связаться с нами" : "Contact sales") : (ru ? "Начать 14-дневный период" : "Start 14-day trial")}
                      </a>
                    </Button>
                    <ul className="mt-7 space-y-3 text-sm text-[var(--text-secondary)]">
                      {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-[var(--green)]" aria-hidden /><span>{feature}</span></li>)}
                    </ul>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              {ru ? "Нужно попробовать сначала? " : "Want to try first? "}
              <Link href="/auth/signup?account=lawyer" className="font-semibold text-[var(--accent)] hover:underline">
                {ru ? "Бесплатный план: 1 проверка, 1 документ и 5 вопросов в месяц — без карты." : "Free plan: 1 review, 1 document and 5 questions a month — no card."}
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
