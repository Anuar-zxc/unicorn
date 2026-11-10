"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import { SALES_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

type PlanKey = "free" | "solo" | "firm" | "enterprise";
export type UsageRow = { feature: "analyses" | "builds" | "questions" | "caseStrategies"; used: number; limit: number };

const copy = {
  ru: {
    eyebrow: "Тариф и использование",
    title: "Оплата",
    current: "Текущий тариф",
    active: "Активен",
    until: (date: string) => `Доступ сохранится до ${date}.`,
    renews: (date: string) => `Следующее списание: ${date}.`,
    manage: "Управлять подпиской",
    usage: "Использование в этом месяце",
    resets: "Лимиты обновляются 1-го числа каждого месяца.",
    unlimited: "без ограничений",
    notIncluded: "не входит в тариф",
    features: {
      analyses: "Проверки договоров",
      builds: "Документы и договоры",
      questions: "Вопросы и налоговые проверки",
      caseStrategies: "Подготовка дел"
    },
    perMonth: "/ месяц",
    currentBadge: "Ваш тариф",
    choose: (name: string) => `Выбрать ${name}`,
    contact: "Связаться с нами",
    errors: {
      polar_not_configured: "Оплата пока не подключена. Напишите нам — мы активируем тариф вручную.",
      no_subscription: "Активная подписка не найдена. Выберите тариф ниже.",
      invalid_plan: "Такого тарифа нет. Выберите тариф ниже.",
      default: "Не удалось открыть оплату. Попробуйте ещё раз."
    },
    plans: {
      solo: ["Все AI-инструменты", "50 проверок и 50 документов в месяц", "200 вопросов в месяц", "Экспорт в Word и PDF"],
      firm: ["До 5 участников", "250 проверок и 250 документов в месяц", "1 000 вопросов в месяц", "Приоритетная обработка"],
      enterprise: ["Без ограничений", "Настраиваемые промпты", "SSO / SAML", "API и SLA"]
    }
  },
  en: {
    eyebrow: "Plan and usage",
    title: "Billing",
    current: "Current plan",
    active: "Active",
    until: (date: string) => `Access remains active until ${date}.`,
    renews: (date: string) => `Next renewal: ${date}.`,
    manage: "Manage subscription",
    usage: "This month's usage",
    resets: "Limits reset on the 1st of every month.",
    unlimited: "unlimited",
    notIncluded: "not included",
    features: {
      analyses: "Contract reviews",
      builds: "Documents and contracts",
      questions: "Questions and tax checks",
      caseStrategies: "Case preparation"
    },
    perMonth: "/ month",
    currentBadge: "Your plan",
    choose: (name: string) => `Choose ${name}`,
    contact: "Contact sales",
    errors: {
      polar_not_configured: "Payments are not connected yet. Contact us and we will activate your plan manually.",
      no_subscription: "No active subscription was found. Choose a plan below.",
      invalid_plan: "That plan does not exist. Choose a plan below.",
      default: "We could not open this billing flow. Please try again."
    },
    plans: {
      solo: ["All AI tools", "50 reviews and 50 documents/month", "200 questions/month", "Word and PDF export"],
      firm: ["Up to 5 team members", "250 reviews and 250 documents/month", "1,000 questions/month", "Priority processing"],
      enterprise: ["Unlimited usage", "Custom prompts", "SSO / SAML", "API and SLA"]
    }
  }
};

const paidPlans = [
  { key: "solo", name: "Solo", price: 19, featured: false },
  { key: "firm", name: "Firm", price: 59, featured: true },
  { key: "enterprise", name: "Enterprise", price: 149, featured: false }
] as const;

export function BillingView({
  current,
  status,
  periodEnd,
  cancelAtPeriodEnd,
  isSubscribed,
  checkoutReady,
  usage,
  error
}: {
  current: PlanKey;
  status: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isSubscribed: boolean;
  checkoutReady: { solo: boolean; firm: boolean };
  usage: UsageRow[];
  error?: string;
}) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const card = "rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6";

  return (
    <main className="p-4 md:p-6">
      <p className="text-sm text-[var(--text-muted)]">{t.eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl font-bold">{t.title}</h1>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm">
          {t.errors[error as keyof typeof t.errors] ?? t.errors.default}
        </p>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <section className={card}>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-[var(--accent)]" aria-hidden />
            <p className="text-sm text-[var(--text-muted)]">{t.current}</p>
            {status === "active" && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                {t.active}
              </span>
            )}
          </div>
          <p className="mt-2 font-display text-4xl font-bold capitalize">{current}</p>
          {periodEnd && (
            <p className={cn("mt-2 text-sm", cancelAtPeriodEnd ? "text-[var(--amber)]" : "text-[var(--text-secondary)]")}>
              {cancelAtPeriodEnd ? t.until(formatDate(periodEnd)) : isSubscribed ? t.renews(formatDate(periodEnd)) : null}
            </p>
          )}
          {isSubscribed && (
            <Button asChild variant="outline" className="mt-5">
              <a href="/api/portal">{t.manage} <ExternalLink className="h-4 w-4" aria-hidden /></a>
            </Button>
          )}
        </section>

        <section className={card}>
          <p className="font-semibold">{t.usage}</p>
          <div className="mt-4 space-y-4">
            {usage.map((row) => {
              const unlimited = !Number.isFinite(row.limit);
              const percent = unlimited || row.limit === 0 ? 0 : Math.min(100, Math.round((row.used / row.limit) * 100));
              return (
                <div key={row.feature}>
                  <div className="flex justify-between text-sm">
                    <span>{t.features[row.feature]}</span>
                    <span className="text-[var(--text-muted)]">
                      {unlimited ? t.unlimited : row.limit === 0 ? t.notIncluded : `${row.used} / ${row.limit}`}
                    </span>
                  </div>
                  {!unlimited && row.limit > 0 && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div className={cn("h-full rounded-full", percent >= 100 ? "bg-amber-500" : "bg-[var(--accent)]")} style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">{t.resets}</p>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {paidPlans.map((plan) => {
          const active = current === plan.key;
          const ready = plan.key === "enterprise" ? true : checkoutReady[plan.key];
          const href =
            plan.key === "enterprise"
              ? `mailto:${SALES_EMAIL}?subject=Lexo%20Enterprise`
              : !ready
                ? "/dashboard/billing?error=polar_not_configured"
                : isSubscribed
                  ? "/api/portal"
                  : `/api/checkout?plan=${plan.key}`;
          return (
            <section key={plan.key} className={cn(card, plan.featured && "border-[var(--accent)]")}>
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl font-bold">{plan.name}</p>
                {active && (
                  <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">{t.currentBadge}</span>
                )}
              </div>
              <p className="mt-5 font-display text-4xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-[var(--text-muted)]"> {t.perMonth}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                {t.plans[plan.key].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--green)]" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              {active ? (
                <Button className="mt-7 w-full" variant="outline" disabled>{t.currentBadge}</Button>
              ) : (
                <Button asChild className="mt-7 w-full" variant={plan.featured ? "primary" : "outline"}>
                  {plan.key === "enterprise" ? (
                    <a href={href}>{t.contact}</a>
                  ) : href.startsWith("/api/") ? (
                    <a href={href}>{t.choose(plan.name)}</a>
                  ) : (
                    <Link href={href}>{t.choose(plan.name)}</Link>
                  )}
                </Button>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
