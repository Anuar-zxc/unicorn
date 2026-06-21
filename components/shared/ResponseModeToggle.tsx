"use client";

import { cn } from "@/lib/utils";
import type { ResponseMode } from "@/lib/ai-prompts";
import { useLanguage } from "@/components/providers/AppProviders";

export function ResponseModeToggle({
  mode,
  onChange
}: {
  mode: ResponseMode;
  onChange: (mode: ResponseMode) => void;
}) {
  const { locale } = useLanguage();
  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange("concise")}
        className={cn(
          "rounded-md px-3 py-1.5 font-semibold text-[var(--text-muted)] transition",
          mode === "concise" && "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
        )}
      >
        ⚡ {locale === "ru" ? "Кратко" : "Concise"}
      </button>
      <button
        type="button"
        onClick={() => onChange("detailed")}
        className={cn(
          "rounded-md px-3 py-1.5 font-semibold text-[var(--text-muted)] transition",
          mode === "detailed" && "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
        )}
      >
        📋 {locale === "ru" ? "Подробно" : "Detailed"}
      </button>
    </div>
  );
}
