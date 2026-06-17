"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const authText = {
  en: {
    email: "Email",
    password: "Password",
    wait: "Please wait...",
    signin: "Log in",
    signup: "Create account",
    reset: "Send reset link",
    resetSent: "Password reset email sent. Check your inbox."
  },
  ru: {
    email: "Email",
    password: "Пароль",
    wait: "Подождите...",
    signin: "Войти",
    signup: "Создать аккаунт",
    reset: "Отправить ссылку",
    resetSent: "Письмо для сброса пароля отправлено. Проверьте почту."
  }
};

export function AuthForm({ mode }: { mode: "signin" | "signup" | "reset" }) {
  const { locale } = useLanguage();
  const text = authText[locale];
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const origin = window.location.origin;
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === "signup"
          ? await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${origin}/auth/callback` }
            })
          : await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${origin}/auth/signin`
            });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "reset") {
      setMessage(text.resetSent);
      return;
    }

    router.push("/dashboard/analyze");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="text-sm font-medium">{text.email}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          required
        />
      </label>
      {mode !== "reset" && (
        <label className="block">
          <span className="text-sm font-medium">{text.password}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            required
            minLength={8}
          />
        </label>
      )}
      {error && (
        <p className="rounded-lg bg-[var(--red-light)] p-3 text-sm text-[var(--red)]">{error}</p>
      )}
      {message && (
        <p className="rounded-lg bg-[var(--green-light)] p-3 text-sm text-[var(--green)]">
          {message}
        </p>
      )}
      <Button className="w-full" disabled={loading}>
        {loading
          ? text.wait
          : mode === "signin"
            ? text.signin
            : mode === "signup"
              ? text.signup
              : text.reset}
      </Button>
    </form>
  );
}
