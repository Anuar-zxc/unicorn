"use client";

import { BadgeCheck, Mail, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import { CONTACT_EMAIL } from "@/lib/site";

export function LawyersComingSoon() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  return (
    <main className="grid min-h-[70vh] place-items-center p-4 md:p-8">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-8 text-center shadow-[var(--shadow-md)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
          <Scale className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          {ru ? "Каталог юристов скоро" : "Lawyer directory coming soon"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {ru
            ? "Мы собираем проверенных юристов Казахстана для консультаций с фиксированной ценой. Ваш отчёт Lexo можно будет передать юристу до звонка."
            : "We are onboarding verified Kazakhstan lawyers for flat-fee consultations. You will be able to share your Lexo report before the call."}
        </p>
        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-[var(--text-secondary)]">
          {(ru
            ? ["Проверка лицензии и опыта", "Цена известна заранее", "Отчёт Lexo — сразу в контексте"]
            : ["Licence and experience checked", "Price known up front", "Your Lexo report shared as context"]
          ).map((item) => (
            <li key={item} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--green)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-7">
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(ru ? "Lexo — юристы" : "Lexo — lawyers")}`}>
            <Mail className="h-4 w-4" aria-hidden />
            {ru ? "Я юрист — хочу подключиться" : "I'm a lawyer — join"}
          </a>
        </Button>
      </section>
    </main>
  );
}
