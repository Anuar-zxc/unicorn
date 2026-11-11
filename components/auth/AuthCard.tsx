"use client";

import Link from "next/link";
import { BookOpenCheck, FileCheck2, LockKeyhole } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";

const panel = {
  ru: {
    title: "Понимайте договор до подписания.",
    points: [
      ["Разбор рисков за минуту", "Lexo находит рискованные условия и предлагает правки."],
      ["Ссылки на законы РК", "Ответы опираются на 2 338 статей из «Әділет»."],
      ["Ваши документы — только ваши", "Приватное хранилище и удаление в один клик."]
    ],
    note: "Бесплатный план · Без банковской карты"
  },
  en: {
    title: "Understand a contract before you sign.",
    points: [
      ["Risk review in a minute", "Lexo flags risky clauses and suggests edits."],
      ["Grounded in Kazakhstan law", "Answers cite 2,338 articles from Adilet."],
      ["Your documents stay yours", "Private storage and one-click deletion."]
    ],
    note: "Free plan · No credit card"
  }
};
const panelIcons = [FileCheck2, BookOpenCheck, LockKeyhole];

const copy = {
  en: {
    signin: ["Welcome back", "Log in to your Lexo workspace.", "Forgot password?", "No account?", "Create one"],
    signup: ["Create your free account", "No credit card needed. Takes less than a minute.", "Already have an account?", "Sign in"],
    reset: ["Reset password", "We will send a secure reset link to your email.", "Remembered it?", "Log in"]
  },
  ru: {
    signin: ["С возвращением", "Войдите в рабочее пространство Lexo.", "Забыли пароль?", "Нет аккаунта?", "Создать"],
    signup: ["Создайте бесплатный аккаунт", "Без банковской карты. Займёт меньше минуты.", "Уже есть аккаунт?", "Войти"],
    reset: ["Сброс пароля", "Мы отправим безопасную ссылку для сброса на email.", "Вспомнили пароль?", "Войти"]
  }
};

export function AuthCard({
  mode,
  next,
  error,
  initialAccountType
}: {
  mode: "signin" | "signup" | "reset";
  next?: string;
  error?: string;
  initialAccountType?: "lawyer" | "individual";
}) {
  const { locale } = useLanguage();
  const text = copy[locale][mode];

  const side = panel[locale];

  return (
    <main id="main" className="grid grid-cols-1 min-h-screen bg-[var(--bg-page)] lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-[#0d1424] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#4d7ef5]/25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden />
        <Link href="/" className="relative w-fit" aria-label="Lexo">
          <Logo className="text-[30px] text-white" />
        </Link>
        <div className="relative my-auto max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em]">{side.title}</h2>
          <ul className="mt-10 space-y-6">
            {side.points.map(([title, body], index) => {
              const Icon = panelIcons[index];
              return (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8fb0ff]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-white/65">{body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="relative text-sm text-white/55">{side.note}</p>
      </aside>

      <div className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:invisible" aria-label="Lexo">
            <Logo className="text-[26px]" />
          </Link>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <section className="mx-auto my-auto w-full max-w-[420px] py-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">{text[0]}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{text[1]}</p>
          <div className="mt-8">
        {error && (
          <p role="alert" className="mb-4 rounded-xl bg-[var(--red-light)] p-3 text-sm text-[var(--red)]">
            {locale === "ru"
              ? "Не удалось завершить вход. Попробуйте ещё раз."
              : "We could not complete sign-in. Please try again."}
          </p>
        )}
        <AuthForm mode={mode} next={next} initialAccountType={initialAccountType} />
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
          </div>
          {mode === "signup" && (
            <p className="mt-8 text-center text-xs leading-5 text-[var(--text-muted)]">
              {locale === "ru" ? "Создавая аккаунт, вы принимаете " : "By creating an account you accept the "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--text-primary)]">{locale === "ru" ? "условия" : "terms"}</Link>
              {locale === "ru" ? " и " : " and "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--text-primary)]">{locale === "ru" ? "политику конфиденциальности" : "privacy policy"}</Link>.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
