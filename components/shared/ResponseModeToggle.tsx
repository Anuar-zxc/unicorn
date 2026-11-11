"use client";

import { AlignLeft, Zap } from "lucide-react";
import { Segmented } from "@/components/ui/segmented";
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
  const ru = locale === "ru";
  return (
    <Segmented
      label={ru ? "Стиль ответа" : "Answer style"}
      value={mode}
      onChange={onChange}
      options={[
        { value: "concise", label: ru ? "Кратко" : "Concise", icon: Zap },
        { value: "detailed", label: ru ? "Подробно" : "Detailed", icon: AlignLeft }
      ]}
    />
  );
}
