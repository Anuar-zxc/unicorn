"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, CreditCard, ExternalLink, KeyRound, LayoutDashboard, Loader2, LogOut, Mail, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountTypeSwitcher } from "@/components/settings/AccountTypeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

const copy = {
  ru: {
    eyebrow: "Настройки",
    title: "Аккаунт и предпочтения",
    workspace: ["Тип кабинета", "Выберите инструменты и главную страницу под ваши задачи."],
    appearance: ["Язык и тема", "Язык интерфейса и светлая или тёмная тема."],
    subscription: ["Подписка", "Тариф, лимиты, счета и способ оплаты."],
    plans: "Тарифы и лимиты",
    manage: "Управлять подпиской",
    account: ["Аккаунт", "Чтобы изменить email, напишите в поддержку."],
    email: "Email",
    password: ["Пароль", "Мы отправим ссылку для смены пароля на ваш email."],
    sendReset: "Отправить ссылку",
    sent: "Письмо отправлено. Проверьте почту.",
    resetError: "Не удалось отправить письмо. Попробуйте позже.",
    signOut: ["Выход", "Выйти из аккаунта на этом устройстве."],
    signOutButton: "Выйти"
  },
  en: {
    eyebrow: "Settings",
    title: "Account and preferences",
    workspace: ["Workspace type", "Choose the tools and home page that match how you use Lexo."],
    appearance: ["Language and theme", "Interface language and light or dark theme."],
    subscription: ["Subscription", "Plan, limits, invoices and payment method."],
    plans: "Plans and limits",
    manage: "Manage subscription",
    account: ["Account", "To change your email, contact support."],
    email: "Email",
    password: ["Password", "We will email you a link to set a new password."],
    sendReset: "Send reset link",
    sent: "Email sent. Check your inbox.",
    resetError: "Could not send the email. Please try again later.",
    signOut: ["Sign out", "Sign out of your account on this device."],
    signOutButton: "Sign out"
  }
};

function Section({
  icon: Icon,
  title,
  description,
  children,
  tone = "default"
}: {
  icon: typeof Mail;
  title: string;
  description: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <section className="grid grid-cols-1 gap-4 border-b border-[var(--border)] py-6 last:border-0 md:grid-cols-[260px_1fr] md:gap-8">
      <div>
        <div className="flex items-center gap-2">
          <Icon className={tone === "danger" ? "h-4 w-4 text-[var(--red)]" : "h-4 w-4 text-[var(--accent)]"} aria-hidden />
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
        <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function SettingsView({
  email,
  accountType,
  hasBillingPortal
}: {
  email: string;
  accountType: "lawyer" | "individual";
  hasBillingPortal: boolean;
}) {
  const { locale } = useLanguage();
  const t = copy[locale];
  const router = useRouter();
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendReset() {
    setResetState("sending");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`
    });
    setResetState(error ? "error" : "sent");
  }

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <p className="text-sm text-[var(--text-muted)]">{t.eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{t.title}</h1>

      <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] px-5 md:px-8">
        <Section icon={LayoutDashboard} title={t.workspace[0]} description={t.workspace[1]}>
          <AccountTypeSwitcher initialType={accountType} />
        </Section>

        <Section icon={Palette} title={t.appearance[0]} description={t.appearance[1]}>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </Section>

        <Section icon={CreditCard} title={t.subscription[0]} description={t.subscription[1]}>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/billing">{t.plans}</Link>
            </Button>
            {hasBillingPortal && (
              <Button asChild variant="outline">
                <a href="/api/portal">{t.manage} <ExternalLink className="h-4 w-4" aria-hidden /></a>
              </Button>
            )}
          </div>
        </Section>

        <Section icon={Mail} title={t.account[0]} description={t.account[1]}>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{t.email}</p>
          <p className="mt-1 break-all text-sm font-medium">{email}</p>
        </Section>

        <Section icon={KeyRound} title={t.password[0]} description={t.password[1]}>
          <Button variant="outline" onClick={() => void sendReset()} disabled={resetState === "sending" || resetState === "sent"}>
            {resetState === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {resetState === "sent" && <Check className="h-4 w-4 text-[var(--green)]" aria-hidden />}
            {t.sendReset}
          </Button>
          <p role="status" className="mt-3 min-h-5 text-sm">
            {resetState === "sent" && <span className="text-[var(--green)]">{t.sent}</span>}
            {resetState === "error" && <span className="text-[var(--red)]">{t.resetError}</span>}
          </p>
        </Section>

        <Section icon={LogOut} title={t.signOut[0]} description={t.signOut[1]} tone="danger">
          <Button variant="outline" onClick={() => void signOut()} className="border-red-500/40 text-[var(--red)] hover:border-red-500 hover:bg-red-500/10">
            <LogOut className="h-4 w-4" aria-hidden />
            {t.signOutButton}
          </Button>
        </Section>
      </div>
    </main>
  );
}
