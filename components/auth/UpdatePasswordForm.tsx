"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured
} from "@/lib/supabase/browser";

export function UpdatePasswordForm() {
  const { locale } = useLanguage();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text =
    locale === "ru"
      ? {
          password: "Новый пароль",
          confirmation: "Повторите пароль",
          button: "Сохранить пароль",
          wait: "Сохраняем...",
          mismatch: "Пароли не совпадают.",
          config: "Авторизация Supabase не настроена.",
          expired: "Ссылка недействительна или истекла. Запросите новую."
        }
      : {
          password: "New password",
          confirmation: "Confirm password",
          button: "Save password",
          wait: "Saving...",
          mismatch: "Passwords do not match.",
          config: "Supabase authentication is not configured.",
          expired: "This link is invalid or expired. Request a new one."
        };

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        if (password !== confirmation) {
          setError(text.mismatch);
          return;
        }
        if (!isSupabaseConfigured()) {
          setError(text.config);
          return;
        }
        setLoading(true);
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          setError(text.expired);
          return;
        }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (updateError) {
          setError(updateError.message);
          return;
        }
        router.replace("/dashboard");
        router.refresh();
      }}
    >
      <label className="block">
        <span className="text-sm font-medium">{text.password}</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">{text.confirmation}</span>
        <input
          type="password"
          name="password-confirmation"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      {error && (
        <p className="rounded-lg bg-[var(--red-light)] p-3 text-sm text-[var(--red)]">
          {error}
        </p>
      )}
      <Button className="w-full" disabled={loading}>
        {loading ? text.wait : text.button}
      </Button>
    </form>
  );
}
