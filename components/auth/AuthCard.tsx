"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  en: {
    signin: ["Welcome back", "Log in to your professional legal workspace.", "Forgot password?", "No account?", "Create one"],
    signup: ["Start your trial", "Set up your Lexo workspace in minutes.", "Already have an account?", "Sign in"],
    reset: ["Reset password", "We will send a secure reset link to your email.", "Remembered it?", "Log in"]
  },
  ru: {
    signin: ["С возвращением", "Войдите в профессиональное юридическое пространство.", "Забыли пароль?", "Нет аккаунта?", "Создать"],
    signup: ["Начните пробный период", "Настройте рабочее пространство Lexo за несколько минут.", "Уже есть аккаунт?", "Войти"],
    reset: ["Сброс пароля", "Мы отправим безопасную ссылку для сброса на email.", "Вспомнили пароль?", "Войти"]
  }
};

export function AuthCard({
  mode,
  next,
  error
}: {
  mode: "signin" | "signup" | "reset";
  next?: string;
  error?: string;
}) {
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
          <Logo className="mx-auto block w-fit text-[52px]" />
          <h1 className="mt-4 font-display text-3xl font-semibold">{text[0]}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{text[1]}</p>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-[var(--red-light)] p-3 text-sm text-[var(--red)]">
            {locale === "ru"
              ? "Не удалось завершить вход. Попробуйте ещё раз."
              : "We could not complete sign-in. Please try again."}
          </p>
        )}
        <AuthForm mode={mode} next={next} />
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
