"use client";

import Link from "next/link";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";

export default function UpdatePasswordPage() {
  const { locale } = useLanguage();
  const ru = locale === "ru";

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-surface)] p-4 grid-bg">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-7 shadow-[var(--shadow-lg)]">
        <div className="mb-7 text-center">
          <div className="mb-4 flex justify-end gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Logo className="mx-auto block w-fit text-[52px]" />
          <h1 className="mt-4 font-display text-3xl font-semibold">
            {ru ? "Новый пароль" : "Set a new password"}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {ru
              ? "Введите новый пароль длиной не менее 8 символов."
              : "Choose a new password with at least 8 characters."}
          </p>
        </div>
        <UpdatePasswordForm />
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <Link href="/auth/signin" className="font-semibold text-[var(--accent)]">
            {ru ? "Вернуться ко входу" : "Back to sign in"}
          </Link>
        </p>
      </section>
    </main>
  );
}
