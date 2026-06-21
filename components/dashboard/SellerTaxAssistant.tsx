"use client";

import { useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponseModeToggle } from "@/components/shared/ResponseModeToggle";
import type { ResponseMode } from "@/lib/ai-prompts";
import { cn } from "@/lib/utils";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import type { AILanguage } from "@/lib/ai-language";
import { useLanguage } from "@/components/providers/AppProviders";

export function SellerTaxAssistant() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const [platform, setPlatform] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [isRegisteredIP, setIsRegisteredIP] = useState("");
  const [productType, setProductType] = useState("");
  const [mode, setMode] = useState<ResponseMode>("concise");
  const [language, setLanguage] = useState<AILanguage>(locale);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const platforms = ["Kaspi", "Wildberries", "OZON", ru ? "Instagram / другое" : "Instagram / Other"];
  const revenues = [ru ? "До 1 млн ₸" : "Under 1M ₸", "1–5 млн ₸", "5–15 млн ₸", "15 млн+ ₸"];
  const registrations = ru ? ["Да", "Нет", "Не уверен(а)"] : ["Yes", "No", "Not sure"];

  async function run() {
    if (!platform || !revenueRange || !isRegisteredIP || !productType.trim()) {
      setError("Complete all fields to get a useful report.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const response = await fetch("/api/seller-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          revenueRange,
          isRegisteredIP,
          productType,
          mode,
          language
        })
      });
      if (!response.ok || !response.body) {
        throw new Error((await response.text()) || "Could not create the tax report.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-500">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <ResponseModeToggle mode={mode} onChange={setMode} />
            <LanguageModeToggle language={language} onChange={setLanguage} />
          </div>
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold">{ru ? "Проверка налогов продавца" : "Marketplace Seller Tax Check"}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {ru ? "Получите практический налоговый чек-лист для продавца в Казахстане." : "Get a practical Kazakhstan tax checklist based on how and where you sell."}
        </p>

        <ChoiceGroup label={ru ? "На какой площадке вы продаёте?" : "What platform do you sell on?"} values={platforms} value={platform} onChange={setPlatform} />
        <ChoiceGroup label={ru ? "Месячный оборот" : "Monthly revenue range"} values={revenues} value={revenueRange} onChange={setRevenueRange} />
        <ChoiceGroup label={ru ? "Вы зарегистрированы как ИП?" : "Are you registered as ИП?"} values={registrations} value={isRegisteredIP} onChange={setIsRegisteredIP} />

        <label className="mt-6 block text-sm font-medium">{ru ? "Что вы продаёте?" : "What do you sell?"}</label>
        <input
          value={productType}
          onChange={(event) => setProductType(event.target.value)}
          placeholder={ru ? "Например: одежда, косметика, электроника, услуги" : "Example: clothes, cosmetics, electronics, digital services"}
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 text-sm outline-none focus:border-[var(--accent)]"
        />
        {error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        <Button className="mt-5 w-full" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4" />}
          {loading ? (ru ? "Проверяем актуальные правила…" : "Checking current rules…") : (ru ? "Создать налоговый чек-лист" : "Create my tax checklist")}
        </Button>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text-muted)]">{ru ? "Персональный отчёт" : "Personalized report"}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{ru ? "Вероятные обязанности и следующие шаги" : "Your likely obligations and next steps"}</h2>
        <div className="mt-5 min-h-[560px] rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-5">
          {output ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[var(--text-secondary)]">{output}</pre>
          ) : (
            <div className="grid min-h-[510px] place-items-center text-center text-sm text-[var(--text-muted)]">
              {ru ? "Заполните форму, чтобы получить практический чек-лист со ссылками на доверенные источники." : "Complete the form to generate a practical checklist with trusted-source references."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ChoiceGroup({
  label,
  values,
  value,
  onChange
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition",
              value === item && "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
