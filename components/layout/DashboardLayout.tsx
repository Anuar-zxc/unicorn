"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CreditCard, Menu, Settings } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Sidebar } from "@/components/layout/Sidebar";
import { Avatar } from "@/components/shared/Avatar";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[.\-_]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function DashboardLayout({
  children,
  userEmail,
  userPlan,
  accountType
}: {
  children: React.ReactNode;
  userEmail: string;
  userPlan: string;
  accountType: "lawyer" | "individual";
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const [plan, setPlan] = useState(userPlan);
  const { locale } = useLanguage();
  const initials = getInitials(userEmail || "CL");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    void supabase
      .from("profiles")
      .select("plan")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.plan) setPlan(data.plan);
      });
  }, []);

  return (
    <div
      className="dashboard-shell min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] lg:flex"
      style={{ "--sidebar-width": collapsed ? "5rem" : "16rem" } as React.CSSProperties}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        userEmail={userEmail}
        userPlan={plan}
        accountType={accountType}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-page)]/92 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              className="-ml-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] lg:hidden"
              aria-label={locale === "ru" ? "Открыть навигацию" : "Open navigation"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/dashboard" className="lg:hidden" aria-label="Lexo">
              <Logo className="text-[26px]" />
            </Link>
            <p className="hidden min-w-0 truncate text-sm font-medium text-[var(--text-secondary)] lg:block">
              {sectionTitle(pathname, locale)}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <details className="group relative">
                <summary
                  className="list-none cursor-pointer rounded-full ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label={locale === "ru" ? "Открыть личный кабинет" : "Open account menu"}
                >
                  <Avatar initials={initials} className="h-11 w-11 text-sm" />
                </summary>
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-3 shadow-[var(--shadow-lg)]">
                  <p className="truncate px-2 text-sm font-semibold">{userEmail}</p>
                  <div className="mt-2 px-2">
                    <PlanBadge plan={plan === "enterprise" ? "Enterprise" : plan === "firm" ? "Firm" : plan === "solo" ? "Solo" : "Free"} />
                  </div>
                  <div className="my-3 h-px bg-[var(--border)]" />
                  <Link href="/dashboard/billing" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]">
                    <CreditCard className="h-4 w-4" />
                    {locale === "ru" ? "Тариф и оплата" : "Plan and billing"}
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]">
                    <Settings className="h-4 w-4" />
                    {locale === "ru" ? "Настройки аккаунта" : "Account settings"}
                  </Link>
                  <LogoutButton />
                </div>
              </details>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-2 sm:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <span className="text-xs text-[var(--text-muted)]">
              {locale === "ru" ? "Язык и оформление" : "Language and appearance"}
            </span>
          </div>
        </header>
        <div id="main">{children}</div>
      </div>
    </div>
  );
}

const SECTION_TITLES: Array<[string, string, string]> = [
  ["/dashboard/history", "Документы и ответы", "Documents and answers"],
  ["/dashboard/docs", "Документы и ответы", "Documents and answers"],
  ["/dashboard/check", "Проверка договора", "Contract check"],
  ["/dashboard/review", "Проверка договоров", "Contract review"],
  ["/dashboard/analyze", "Проверка договоров", "Contract review"],
  ["/dashboard/build", "Конструктор договоров", "Contract builder"],
  ["/dashboard/draft", "Подготовка документов", "Drafting"],
  ["/dashboard/ask", "Юридический вопрос", "Legal question"],
  ["/dashboard/seller-tax", "Налоги продавца", "Seller taxes"],
  ["/dashboard/research", "Правовой поиск", "Legal research"],
  ["/dashboard/caseprep", "Подготовка дела", "Case prep"],
  ["/dashboard/compare", "Сравнение версий", "Version comparison"],
  ["/dashboard/client", "Резюме для клиента", "Client summary"],
  ["/dashboard/billing", "Тариф и оплата", "Plan and billing"],
  ["/dashboard/settings", "Настройки", "Settings"],
  ["/dashboard/onboarding", "Начало работы", "Getting started"]
];

function sectionTitle(pathname: string | null, locale: "ru" | "en") {
  const match = SECTION_TITLES.find(([prefix]) => pathname?.startsWith(prefix));
  if (match) return locale === "ru" ? match[1] : match[2];
  return locale === "ru" ? "Обзор" : "Overview";
}
