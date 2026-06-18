"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const authText = {
  en: {
    fullName: "Full name",
    company: "Firm name (optional)",
    email: "Email",
    password: "Password",
    wait: "Please wait...",
    signin: "Log in",
    signup: "Create account",
    reset: "Send reset link",
    resetSent: "Password reset email sent. Check your inbox.",
    google: "Continue with Google",
    divider: "or"
  },
  ru: {
    fullName: "Полное имя",
    company: "Название фирмы (необязательно)",
    email: "Email",
    password: "Пароль",
    wait: "Подождите...",
    signin: "Войти",
    signup: "Создать аккаунт",
    reset: "Отправить ссылку",
    resetSent: "Письмо для сброса пароля отправлено. Проверьте почту.",
    google: "Продолжить с Google",
    divider: "или"
  }
};

export function AuthForm({ mode }: { mode: "signin" | "signup" | "reset" }) {
  const { locale } = useLanguage();
  const text = authText[locale];
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
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

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/signin`
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMessage(text.resetSent);
      return;
    }

    if (mode === "signin") {
      const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signinError) {
        setError(signinError.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: { full_name: fullName, company }
      }
    });
    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        company
      });
    }

    router.push("/dashboard/onboarding");
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const origin = window.location.origin;
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=/dashboard` }
    });
    if (googleError) {
      setLoading(false);
      setError(googleError.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {mode !== "reset" && (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="focus-ring flex h-11 w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-page)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          >
            {text.google}
          </button>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            {text.divider}
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <label className="block">
            <span className="text-sm font-medium">{text.fullName}</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">{text.company}</span>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </label>
        </>
      )}
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
