"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CreditCard,
  ChevronLeft,
  FileCheck2,
  FolderOpen,
  GitCompareArrows,
  LayoutGrid,
  MessageCircleQuestion,
  ReceiptText,
  PenLine,
  SearchCheck,
  Settings,
  Sparkles
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Logo } from "@/components/shared/Logo";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  en: string;
  ru: string;
  icon: typeof LayoutGrid;
  badge?: string;
};

const lawyerItems: NavItem[] = [
  { href: "/dashboard", en: "Workspace", ru: "Рабочее пространство", icon: LayoutGrid },
  { href: "/dashboard/review", en: "Contract Review", ru: "Проверка договоров", icon: FileCheck2 },
  { href: "/dashboard/research", en: "Case Research", ru: "Правовой поиск", icon: SearchCheck },
  { href: "/dashboard/draft", en: "Drafting", ru: "Подготовка документов", icon: PenLine },
  { href: "/dashboard/caseprep", en: "Case Prep", ru: "Подготовка дела", icon: BriefcaseBusiness },
  { href: "/dashboard/compare", en: "Redline", ru: "Сравнение версий", icon: GitCompareArrows },
  { href: "/dashboard/client", en: "Client Briefs", ru: "Резюме клиенту", icon: MessageCircleQuestion },
  { href: "/dashboard/docs", en: "All Documents", ru: "Все документы", icon: FolderOpen },
  { href: "/dashboard/billing", en: "Billing", ru: "Оплата", icon: CreditCard },
  { href: "/dashboard/settings", en: "Settings", ru: "Настройки", icon: Settings }
];

const individualItems: NavItem[] = [
  { href: "/dashboard", en: "Home", ru: "Главная", icon: LayoutGrid },
  { href: "/dashboard/check", en: "Check a Contract", ru: "Проверить договор", icon: FileCheck2 },
  { href: "/dashboard/build", en: "Build an Agreement", ru: "Создать договор", icon: PenLine },
  { href: "/dashboard/ask", en: "Ask a Question", ru: "Задать вопрос", icon: MessageCircleQuestion },
  { href: "/dashboard/seller-tax", en: "Seller Taxes", ru: "Налоги продавца", icon: ReceiptText, badge: "New" },
  { href: "/dashboard/docs", en: "My Documents", ru: "Мои документы", icon: FolderOpen },
  { href: "/dashboard/billing", en: "Billing", ru: "Оплата", icon: CreditCard },
  { href: "/dashboard/settings", en: "Settings", ru: "Настройки", icon: Settings }
];

function initials(email: string) { return email.split("@")[0].split(/[.\-_]/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "LX"; }

export function Sidebar({
  collapsed,
  onToggle,
  userEmail,
  userPlan,
  accountType
}: {
  collapsed: boolean;
  onToggle: () => void;
  userEmail: string;
  userPlan: string;
  accountType: "lawyer" | "individual";
}) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const items = accountType === "lawyer" ? lawyerItems : individualItems;

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <aside className={cn("hidden h-screen shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-all lg:flex lg:flex-col", collapsed ? "w-20" : "w-64")}>
      <div className="flex items-center justify-between">
        <Link href="/dashboard"><Logo markOnly={collapsed} className={collapsed ? "text-[26px]" : "text-[28px]"} /></Link>
        <button aria-label="Toggle sidebar" onClick={onToggle} className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"><ChevronLeft className={cn("h-4 w-4", collapsed && "rotate-180")} /></button>
      </div>
      <div className={cn("mt-7 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-3", collapsed && "hidden")}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <Sparkles className="h-4 w-4 text-[#5d86ff]" strokeWidth={2.6} />
          MVP Suite
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
          {accountType === "lawyer"
            ? locale === "ru"
              ? "Загружайте, проверяйте и готовьте юридические документы в одном месте."
              : "Upload, review, draft, and prepare legal work in one place."
            : locale === "ru"
              ? "Проверяйте договоры, задавайте вопросы и разбирайтесь с налогами простым языком."
              : "Check contracts, ask questions, and understand seller taxes in plain language."}
        </p>
      </div>
      <nav className="mt-6 space-y-1.5">
        {items.map((item) => {
          const label = locale === "ru" ? item.ru : item.en;
          const activePath = pendingHref ?? pathname;
          const active = item.href === "/dashboard" ? activePath === item.href : activePath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={() => setPendingHref(item.href)}
              title={collapsed ? label : undefined}
              className={cn(
                "group flex h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                active && "bg-[#2f64f1] text-white shadow-[0_10px_28px_rgba(47,100,241,0.28)]"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-page)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]",
                  active && "border-white/15 bg-white/15 text-white"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={2.65} />
              </span>
              {!collapsed && (
                <>
                  <span>{label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] text-amber-500">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-3">
        <div className="flex items-center gap-3"><Avatar initials={initials(userEmail)} className="h-9 w-9 text-xs" />{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-semibold">{userEmail}</p><PlanBadge plan={userPlan === "enterprise" ? "Enterprise" : userPlan === "firm" ? "Firm" : userPlan === "solo" ? "Solo" : "Free"} /></div>}</div>
        {!collapsed && <div className="mt-3"><LogoutButton /></div>}
      </div>
    </aside>
  );
}
