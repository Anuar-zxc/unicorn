"use client";

import { useState } from "react";
import { Scale, UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/AppProviders";

export function AccountTypeSwitcher({
  initialType
}: {
  initialType: "lawyer" | "individual";
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const [accountType, setAccountType] = useState(initialType);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function update(next: "lawyer" | "individual") {
    setSaving(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage(ru ? "Войдите снова." : "Please sign in again.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ account_type: next })
      .eq("id", user.id);
    if (error) {
      setMessage(ru ? "Не удалось сохранить. Попробуйте ещё раз." : "Could not save. Please try again.");
    } else {
      setAccountType(next);
      setMessage(ru ? "Кабинет обновлён. Перезагружаем…" : "Workspace updated. Reloading…");
      window.location.assign("/dashboard");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={saving || accountType === "lawyer"}
          aria-pressed={accountType === "lawyer"}
          onClick={() => update("lawyer")}
          className={cn(
            "cursor-pointer rounded-2xl border p-4 text-left transition-colors duration-150 disabled:cursor-default",
            accountType === "lawyer"
              ? "border-[var(--accent)] bg-[var(--accent-light)]"
              : "border-[var(--border-strong)] bg-[var(--bg-page)] hover:border-[var(--accent)]"
          )}
        >
          <Scale className="h-5 w-5 text-[var(--accent)]" aria-hidden />
          <p className="mt-3 text-sm font-semibold">{ru ? "Кабинет юриста" : "Lawyer workspace"}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
            {ru ? "Поиск, документы, подготовка дел, сравнение версий и резюме для клиентов." : "Research, drafting, case prep, redlines, and client briefs."}
          </p>
        </button>
        <button
          type="button"
          disabled={saving || accountType === "individual"}
          aria-pressed={accountType === "individual"}
          onClick={() => update("individual")}
          className={cn(
            "cursor-pointer rounded-2xl border p-4 text-left transition-colors duration-150 disabled:cursor-default",
            accountType === "individual"
              ? "border-[var(--accent)] bg-[var(--accent-light)]"
              : "border-[var(--border-strong)] bg-[var(--bg-page)] hover:border-[var(--accent)]"
          )}
        >
          <UserRound className="h-5 w-5 text-[var(--accent)]" aria-hidden />
          <p className="mt-3 text-sm font-semibold">{ru ? "Личный кабинет" : "Personal workspace"}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
            {ru ? "Проверка договоров, вопросы и налоги продавца." : "Contract checks, questions, and marketplace seller taxes."}
          </p>
        </button>
      </div>
      {message && <p role="status" className="mt-3 text-xs text-[var(--text-secondary)]">{message}</p>}
    </div>
  );
}
