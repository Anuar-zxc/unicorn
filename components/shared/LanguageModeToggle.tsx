"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AILanguage } from "@/lib/ai-language";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/AppProviders";

export function LanguageModeToggle({
  language,
  onChange
}: {
  language: AILanguage;
  onChange: (language: AILanguage) => void;
}) {
  const { locale } = useLanguage();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("lexo-ai-language");
    if (saved === "ru" || saved === "en") {
      onChange(saved);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    void supabase
      .from("profiles")
      .select("ai_language")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.ai_language === "ru") {
          onChange(data.ai_language);
        } else {
          onChange(locale);
        }
      });
  }, [locale, onChange]);

  async function select(next: AILanguage) {
    onChange(next);
    window.localStorage.setItem("lexo-ai-language", next);
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ ai_language: next })
        .eq("id", user.id);
    }
    setSaving(false);
  }

  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-1 text-xs">
      {(["en", "ru"] as const).map((item) => (
        <button
          key={item}
          type="button"
          disabled={saving}
          onClick={() => select(item)}
          className={cn(
            "rounded-md px-3 py-1.5 font-semibold uppercase text-[var(--text-muted)] transition",
            language === item &&
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
          )}
        >
          {item === "en" ? "🇬🇧 EN" : "🇷🇺 RU"}
        </button>
      ))}
    </div>
  );
}
