"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  en: {
    signin: ["Welcome back", "Log in to analyze your contracts.", "Forgot password?", "No account?", "Create one"],
    signup: ["Start free", "Analyze your first contract in minutes.", "Already have an account?", "Sign in"],
    reset: ["Reset password", "We will send a secure reset link to your email.", "Remembered it?", "Log in"]
  },
  ru: {
    signin: ["С возвращением", "Войдите, чтобы анализировать договоры.", "Забыли пароль?", "Нет аккаунта?", "Создать"],
    signup: ["Начните бесплатно", "Проверьте первый договор за несколько минут.", "Уже есть аккаунт?", "Войти"],
    reset: ["Сброс пароля", "Мы отправим безопасную ссылку для сброса на email.", "Вспомнили пароль?", "Войти"]
  }
};

export function AuthCard({ mode }: { mode: "signin" | "signup" | "reset" }) {
  const { locale } = useLanguage();
  const text = copy[locale][mode];

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-surface)] p-4 grid-bg">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-7 shadow-[var(--shadow-lg)]">
        <div className="mb-7 text-center">
          <div className="mb-4 flex justify-end gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold">{text[0]}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{text[1]}</p>
        </div>
        <AuthForm mode={mode} />
        {mode === "signin" && (
          <>
            <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
              <Link href="/auth/reset" className="font-semibold text-[var(--accent)]">{text[2]}</Link>
            </p>
            <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
              {text[3]} <Link href="/auth/signup" className="font-semibold text-[var(--accent)]">{text[4]}</Link>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {text[2]} <Link href="/auth/signin" className="font-semibold text-[var(--accent)]">{text[3]}</Link>
          </p>
        )}
        {mode === "reset" && (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {text[2]} <Link href="/auth/signin" className="font-semibold text-[var(--accent)]">{text[3]}</Link>
          </p>
        )}
      </section>
    </main>
  );
}
