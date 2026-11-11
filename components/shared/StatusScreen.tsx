"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

type Copy = { title: string; body: string; primary: string; secondary?: string };

/** Shared layout for 404 / error / offline states. */
export function StatusScreen({
  icon: Icon,
  code,
  ru,
  en,
  primaryHref = "/",
  onPrimary,
  secondaryHref
}: {
  icon: LucideIcon;
  code?: string;
  ru: Copy;
  en: Copy;
  primaryHref?: string;
  onPrimary?: () => void;
  secondaryHref?: string;
}) {
  const { locale } = useLanguage();
  const t = locale === "ru" ? ru : en;
  return (
    <main id="main" className="grid min-h-[70vh] place-items-center p-6">
      <section className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        {code && <p className="mt-6 font-display text-sm font-semibold tracking-[.2em] text-[var(--text-muted)]">{code}</p>}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{t.body}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {onPrimary ? (
            <Button onClick={onPrimary}>{t.primary}</Button>
          ) : (
            <Button asChild>
              <Link href={primaryHref}>{t.primary}</Link>
            </Button>
          )}
          {t.secondary && secondaryHref && (
            <Button asChild variant="outline">
              <Link href={secondaryHref}>{t.secondary}</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
