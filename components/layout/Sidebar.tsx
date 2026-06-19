"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CreditCard,
  ChevronLeft,
  FileCheck2,
  FolderOpen,
  GitCompareArrows,
  LayoutGrid,
  MessageCircleQuestion,
  PenLine,
  SearchCheck,
  Settings,
  Sparkles
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Logo } from "@/components/shared/Logo";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Workspace", icon: LayoutGrid },
  { href: "/dashboard/review", label: "Contract Review", icon: FileCheck2 },
  { href: "/dashboard/research", label: "Case Research", icon: SearchCheck },
  { href: "/dashboard/draft", label: "Drafting", icon: PenLine },
  { href: "/dashboard/caseprep", label: "Case Prep", icon: BriefcaseBusiness },
  { href: "/dashboard/compare", label: "Redline", icon: GitCompareArrows },
  { href: "/dashboard/client", label: "Client Briefs", icon: MessageCircleQuestion },
  { href: "/dashboard/docs", label: "All Documents", icon: FolderOpen },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

function initials(email: string) { return email.split("@")[0].split(/[.\-_]/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "LX"; }

export function Sidebar({ collapsed, onToggle, userEmail, userPlan }: { collapsed: boolean; onToggle: () => void; userEmail: string; userPlan: string }) {
  const pathname = usePathname();
  return (
    <aside className={cn("hidden h-screen shrink-0 border-r border-[#252b36] bg-[#0b0e14] p-4 transition-all lg:flex lg:flex-col", collapsed ? "w-20" : "w-64")}>
      <div className="flex items-center justify-between">
        <Link href="/dashboard"><Logo markOnly={collapsed} className={collapsed ? "text-[26px]" : "text-[28px] text-white"} /></Link>
        <button aria-label="Toggle sidebar" onClick={onToggle} className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white"><ChevronLeft className={cn("h-4 w-4", collapsed && "rotate-180")} /></button>
      </div>
      <div className={cn("mt-7 rounded-2xl border border-white/8 bg-white/[0.03] p-3", collapsed && "hidden")}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
          <Sparkles className="h-4 w-4 text-[#5d86ff]" strokeWidth={2.6} />
          MVP Suite
        </div>
        <p className="mt-2 text-xs leading-5 text-white/45">
          Upload, review, draft, and prepare legal work in one place.
        </p>
      </div>
      <nav className="mt-6 space-y-1.5">
        {items.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-white/62 transition hover:bg-white/[0.06] hover:text-white",
                active && "bg-[#2f64f1] text-white shadow-[0_10px_28px_rgba(47,100,241,0.28)]"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/72 group-hover:border-white/15 group-hover:text-white",
                  active && "border-white/15 bg-white/15 text-white"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={2.65} />
              </span>
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-[#252b36] bg-[#131720] p-3">
        <div className="flex items-center gap-3"><Avatar initials={initials(userEmail)} className="h-9 w-9 text-xs" />{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-semibold">{userEmail}</p><PlanBadge plan={userPlan === "enterprise" ? "Enterprise" : userPlan === "firm" ? "Firm" : userPlan === "solo" ? "Solo" : "Free"} /></div>}</div>
        {!collapsed && <div className="mt-3"><LogoutButton /></div>}
      </div>
    </aside>
  );
}
