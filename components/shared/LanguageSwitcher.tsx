"use client";

import { useLanguage } from "@/components/providers/AppProviders";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      aria-label="Switch language"
      className="focus-ring inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
      onClick={() => setLocale(locale === "en" ? "ru" : "en")}
    >
      <span className={locale === "en" ? "text-[var(--accent)]" : ""}>EN</span>
      <span className="mx-1 text-[var(--text-muted)]">/</span>
      <span className={locale === "ru" ? "text-[var(--accent)]" : ""}>RU</span>
    </button>
  );
}
