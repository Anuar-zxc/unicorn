"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileCheck2, Loader2, MessageCircleQuestion, ReceiptText } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

const copy = {
  ru: {
    step: (n: number) => `Шаг ${n} из 3`,
    welcome: "Добро пожаловать в Lexo. Настроим рабочее пространство.",
    areas: "Специализация",
    areaList: ["Корпоративное право", "Судебные споры", "Трудовое право", "Интеллектуальная собственность", "Недвижимость", "Уголовное право", "Другое"],
    jurisdiction: "Основная юрисдикция",
    jurisdictionPlaceholder: "Например: Казахстан, Алматы",
    firm: "Размер практики",
    firmSizes: ["Частная практика", "2–5", "6–20", "20+"],
    next: "Продолжить",
    back: "Назад",
    sinkTitle: "На что уходит больше всего времени?",
    sinks: ["Проверка договоров", "Правовой поиск", "Подготовка документов", "Общение с клиентами"],
    readyTitle: "Готово. Попробуйте на реальном договоре.",
    readyBody: "Загрузите договор клиента — Lexo найдёт риски, предложит формулировки и сохранит отчёт в истории.",
    upload: "Загрузить договор",
    skip: "Перейти в кабинет",
    personalTitle: "Ваш юридический помощник готов.",
    personalBody: "Вот что Lexo умеет уже сейчас:",
    personalItems: [
      ["Проверить договор", "Риски и правки простым языком"],
      ["Задать вопрос", "Ответы со ссылками на законы РК"],
      ["Налоги продавца", "Чек-лист для Kaspi и Wildberries"]
    ],
    open: "Открыть мой кабинет"
  },
  en: {
    step: (n: number) => `Step ${n} of 3`,
    welcome: "Welcome to Lexo. Let’s set up your workspace.",
    areas: "Practice areas",
    areaList: ["Corporate", "Litigation", "Employment", "Intellectual property", "Real estate", "Criminal", "Other"],
    jurisdiction: "Primary jurisdiction",
    jurisdictionPlaceholder: "Example: Kazakhstan, Almaty",
    firm: "Practice size",
    firmSizes: ["Solo", "2–5", "6–20", "20+"],
    next: "Continue",
    back: "Back",
    sinkTitle: "What takes most of your time?",
    sinks: ["Contract review", "Legal research", "Document drafting", "Client communication"],
    readyTitle: "All set. Try it on a real contract.",
    readyBody: "Upload a client contract — Lexo finds the risks, drafts replacement wording, and saves the report to history.",
    upload: "Upload a contract",
    skip: "Go to workspace",
    personalTitle: "Your legal assistant is ready.",
    personalBody: "Here is what Lexo can do right now:",
    personalItems: [
      ["Check a contract", "Risks and edits in plain language"],
      ["Ask a question", "Answers citing Kazakhstan law"],
      ["Seller taxes", "Checklist for Kaspi and Wildberries"]
    ],
    open: "Open my workspace"
  }
};

const personalIcons = [FileCheck2, MessageCircleQuestion, ReceiptText];

export default function OnboardingPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = copy[locale];
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState(locale === "ru" ? "Казахстан" : "Kazakhstan");
  const [firmSize, setFirmSize] = useState(t.firmSizes[0]);
  const [timeSink, setTimeSink] = useState("");
  const [saving, setSaving] = useState(false);
  const [accountType, setAccountType] = useState<"lawyer" | "individual" | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Never leave the user on a spinner: fall back to the personal flow.
    const fallback = setTimeout(() => !cancelled && setAccountType((current) => current ?? "individual"), 2_500);
    supabase
      .from("profiles")
      .select("account_type")
      .maybeSingle()
      .then(
        ({ data }) => !cancelled && setAccountType(data?.account_type === "lawyer" ? "lawyer" : "individual"),
        () => !cancelled && setAccountType("individual")
      );
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [supabase]);

  function toggleArea(area: string) {
    setAreas((current) => (current.includes(area) ? current.filter((item) => item !== area) : [...current, area]));
  }

  async function complete(update: Record<string, unknown>, destination: string) {
    setSaving(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").update({ ...update, onboarding_completed: true }).eq("id", user.id);
    } finally {
      router.push(destination);
      router.refresh();
    }
  }

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150",
      active
        ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)]"
        : "border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
    );

  if (!accountType) {
    return (
      <main className="grid min-h-[calc(100vh-81px)] place-items-center" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" aria-label="Loading" />
      </main>
    );
  }

  if (accountType === "individual") {
    return (
      <main className="grid min-h-[calc(100vh-81px)] place-items-center p-4 md:p-8">
        <section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-7 shadow-[var(--shadow-md)] md:p-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">{t.personalTitle}</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{t.personalBody}</p>
          <ul className="mt-6 space-y-3">
            {t.personalItems.map(([title, description], index) => {
              const Icon = personalIcons[index];
              return (
                <li key={title} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="block text-sm text-[var(--text-secondary)]">{description}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <Button size="lg" className="mt-7 w-full" onClick={() => void complete({}, "/dashboard")} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {t.open}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-[calc(100vh-81px)] place-items-center p-4 md:p-8">
      <section className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-md)] md:p-9">
        <div className="flex gap-2" aria-hidden>
          {[1, 2, 3].map((item) => (
            <span key={item} className={cn("h-1.5 flex-1 rounded-full bg-[var(--bg-elevated)] transition-colors", item <= step && "bg-[var(--accent-solid)]")} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--accent)]">{t.step(step)}</p>
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t.back}
            </button>
          )}
        </div>

        {step === 1 && (
          <>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{t.welcome}</h1>
            <fieldset className="mt-7">
              <legend className="text-sm font-medium">{t.areas}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.areaList.map((area) => (
                  <button key={area} type="button" aria-pressed={areas.includes(area)} onClick={() => toggleArea(area)} className={chip(areas.includes(area))}>
                    {areas.includes(area) && <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden />}
                    {area}
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="onboarding-jurisdiction" className="mt-6 block text-sm font-medium">{t.jurisdiction}</label>
            <input
              id="onboarding-jurisdiction"
              value={jurisdiction}
              onChange={(event) => setJurisdiction(event.target.value)}
              placeholder={t.jurisdictionPlaceholder}
              className="input-base mt-2 h-12 px-4"
            />
            <fieldset className="mt-6">
              <legend className="text-sm font-medium">{t.firm}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {t.firmSizes.map((size) => (
                  <button key={size} type="button" aria-pressed={firmSize === size} onClick={() => setFirmSize(size)} className={cn(chip(firmSize === size), "justify-center rounded-xl")}>
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
            <Button size="lg" className="mt-8 w-full" onClick={() => setStep(2)} disabled={!areas.length || !jurisdiction.trim()}>
              {t.next}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{t.sinkTitle}</h1>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.sinkTitle}>
              {t.sinks.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={timeSink === item}
                  onClick={() => setTimeSink(item)}
                  className={cn(chip(timeSink === item), "justify-between rounded-2xl p-4 text-left")}
                >
                  <span>{item}</span>
                  {timeSink === item && <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden />}
                </button>
              ))}
            </div>
            <Button size="lg" className="mt-8 w-full" onClick={() => setStep(3)} disabled={!timeSink}>
              {t.next}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
              <FileCheck2 className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight md:text-3xl">{t.readyTitle}</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{t.readyBody}</p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button size="lg" onClick={() => void complete({ practice_areas: areas, jurisdiction, firm_size: firmSize, biggest_time_sink: timeSink }, "/dashboard/review")} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {t.upload}
              </Button>
              <Button size="lg" variant="outline" onClick={() => void complete({ practice_areas: areas, jurisdiction, firm_size: firmSize, biggest_time_sink: timeSink }, "/dashboard")} disabled={saving}>
                {t.skip}
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
