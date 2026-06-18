"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, FileDiff, FileSearch, FileText, FolderKanban, LayoutDashboard, MessageSquareText, Settings, Files } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Logo } from "@/components/shared/Logo";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Workspace", icon: LayoutDashboard },
  { href: "/dashboard/review", label: "Contract Review", icon: FileSearch },
  { href: "/dashboard/research", label: "Case Research", icon: BookOpen },
  { href: "/dashboard/draft", label: "Drafting", icon: FileText },
  { href: "/dashboard/caseprep", label: "Case Prep", icon: FolderKanban },
  { href: "/dashboard/compare", label: "Redline", icon: FileDiff },
  { href: "/dashboard/client", label: "Client Briefs", icon: MessageSquareText },
  { href: "/dashboard/docs", label: "All Documents", icon: Files },
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
      <nav className="mt-8 space-y-1">
        {items.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={cn("flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/58 hover:bg-white/5 hover:text-white", active && "bg-[#255ee8] text-white")}><item.icon className="h-[18px] w-[18px] shrink-0" />{!collapsed && item.label}</Link>;
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-[#252b36] bg-[#131720] p-3">
        <div className="flex items-center gap-3"><Avatar initials={initials(userEmail)} className="h-9 w-9 text-xs" />{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-semibold">{userEmail}</p><PlanBadge plan={userPlan === "firm" ? "Firm" : "Solo"} /></div>}</div>
        {!collapsed && <div className="mt-3"><LogoutButton /></div>}
      </div>
    </aside>
  );
}
