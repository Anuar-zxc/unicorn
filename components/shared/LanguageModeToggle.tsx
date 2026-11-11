"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AILanguage } from "@/lib/ai-language";
import { Languages } from "lucide-react";
import { Segmented } from "@/components/ui/segmented";
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
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem("lexo-ai-language");
    } catch {
      // Storage unavailable — fall back to profile/locale.
    }
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
    try {
      window.localStorage.setItem("lexo-ai-language", next);
    } catch {
      // Ignore: the choice still applies for this visit.
    }
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
    <Segmented
      label={locale === "ru" ? "Язык ответа" : "Answer language"}
      value={language}
      onChange={(next) => void select(next)}
      disabled={saving}
      options={[
        { value: "ru", label: "RU", icon: Languages },
        { value: "en", label: "EN" }
      ]}
    />
  );
}
