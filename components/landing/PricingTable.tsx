"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/AppProviders";

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
      features: ["1 contract check/month", "5 legal questions/month", "Basic seller tax check", "Trusted-source references"]
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
      features: ["1 проверка договора в месяц", "5 юридических вопросов в месяц", "Базовая проверка налогов продавца", "Ссылки на доверенные источники"]
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
  const plans = locale === "ru" ? plansRu : plansEn;
  const [audience, setAudience] = useState<"lawyer" | "individual">("lawyer");
  const annualAvailable = Boolean(
    process.env.NEXT_PUBLIC_POLAR_SOLO_ANNUAL_PRODUCT_ID &&
      process.env.NEXT_PUBLIC_POLAR_FIRM_ANNUAL_PRODUCT_ID
  );
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="border-y border-[var(--border)] bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{locale === "ru" ? "Тарифы" : "Pricing"}</p>
          <h2 className="text-h2 mt-3">{locale === "ru" ? "Больше возможностей без найма новых сотрудников." : "Capacity without another salary."}</h2>
          <div className="mt-7 inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-1">
            <button
              className={cn("rounded-md px-5 py-2 text-sm font-semibold", audience === "lawyer" && "bg-[var(--accent)] text-white")}
              onClick={() => setAudience("lawyer")}
            >
              {locale === "ru" ? "Для юристов" : "For lawyers"}
            </button>
            <button
              className={cn("rounded-md px-5 py-2 text-sm font-semibold", audience === "individual" && "bg-[var(--accent)] text-white")}
              onClick={() => {
                setAudience("individual");
                setAnnual(false);
              }}
            >
              {locale === "ru" ? "Для частных лиц" : "For individuals"}
            </button>
          </div>
          {audience === "lawyer" && (
          <div className="mt-7 inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-1">
            <button className={cn("rounded-md px-5 py-2 text-sm font-semibold", !annual && "bg-[var(--accent)] text-white")} onClick={() => setAnnual(false)}>{locale === "ru" ? "Ежемесячно" : "Monthly"}</button>
            <button
              className={cn(
                "rounded-md px-5 py-2 text-sm font-semibold",
                annual && "bg-[var(--accent)] text-white",
                !annualAvailable && "cursor-not-allowed opacity-45"
              )}
              onClick={() => annualAvailable && setAnnual(true)}
              disabled={!annualAvailable}
              title={!annualAvailable ? (locale === "ru" ? "Годовая оплата скоро появится" : "Annual billing is coming soon") : undefined}
            >
              {annualAvailable
                ? (locale === "ru" ? "Ежегодно · скидка 20%" : "Annual · save 20%")
                : (locale === "ru" ? "Ежегодно · скоро" : "Annual · coming soon")}
            </button>
          </div>
          )}
        </div>
        {audience === "individual" ? (
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {individualPlans[locale].map((plan) => (
              <article
                key={plan.name}
                className={cn(
                  "relative rounded-xl border bg-[var(--bg-page)] p-7",
                  plan.highlight ? "border-[var(--accent)] shadow-[var(--shadow-lg)]" : "border-[var(--border)]"
                )}
              >
                {plan.badge && <span className="absolute right-5 top-5 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">{plan.badge}</span>}
                <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-semibold">${plan.price}</span>
                  <span className="pb-2 text-sm text-[var(--text-secondary)]">{locale === "ru" ? "/месяц" : "/month"}</span>
                </div>
                <Link href="/auth/signup">
                  <Button className="mt-6 w-full" variant={plan.highlight ? "primary" : "outline"}>
                    {locale === "ru" ? "Начать бесплатно" : "Get started"}
                  </Button>
                </Link>
                <ul className="mt-7 space-y-3 text-sm text-[var(--text-secondary)]">
                  {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-[var(--green)]" /><span>{feature}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        ) : (
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={cn("relative rounded-xl border bg-[var(--bg-page)] p-7", plan.highlight ? "border-[var(--accent)] shadow-[var(--shadow-lg)]" : "border-[var(--border)]")}>
              {plan.badge && <span className="absolute right-5 top-5 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">{plan.badge}</span>}
              <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-semibold">${annual ? plan.price.annual : plan.price.monthly}</span>
                <span className="pb-2 text-sm text-[var(--text-secondary)]">{locale === "ru" ? "/месяц" : "/month"}</span>
              </div>
              {annual && <p className="mt-2 text-xs text-[var(--text-muted)]">{locale === "ru" ? "Оплата за год" : "Billed annually"}</p>}
              <Link href={plan.name === "Enterprise" ? "mailto:sales@lexo.ai?subject=Lexo Enterprise" : `/api/checkout?plan=${plan.name === "Solo" ? "solo" : "firm"}&billing=${annual && annualAvailable ? "annual" : "monthly"}`}><Button className="mt-6 w-full" variant={plan.highlight ? "primary" : "outline"}>{plan.name === "Enterprise" ? (locale === "ru" ? "Связаться с нами" : "Contact sales") : (locale === "ru" ? "Начать 14-дневный период" : "Start 14-day trial")}</Button></Link>
              <ul className="mt-7 space-y-3 text-sm text-[var(--text-secondary)]">
                {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-[var(--green)]" /><span>{feature}</span></li>)}
              </ul>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
