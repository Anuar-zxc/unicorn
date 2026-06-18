"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ChevronLeft,
  CreditCard,
  FilePlus,
  FileSearch,
  LayoutDashboard,
  Scale,
  Settings,
  Users
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Logo } from "@/components/shared/Logo";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/analyze", label: "Analyze Contract", icon: FileSearch },
  { href: "/dashboard/build", label: "Build Contract", icon: FilePlus },
  { href: "/dashboard/case", label: "Case Strategy", icon: Scale, badge: "New" },
  { href: "/dashboard/history", label: "My Documents", icon: Archive },
  { href: "/dashboard/lawyers", label: "Find a Lawyer", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[.\-_]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function Sidebar({
  collapsed,
  onToggle,
  userEmail,
  userPlan
}: {
  collapsed: boolean;
  onToggle: () => void;
  userEmail: string;
  userPlan: string;
}) {
  const pathname = usePathname();
  const initials = getInitials(userEmail || "CL");

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-[#252528] bg-[#0C0C0E] p-4 transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-60"
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex min-w-0 items-center">
          {collapsed ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A56E8]/15">
              <Logo markOnly className="text-[22px] text-white" />
            </span>
          ) : (
            <Logo className="text-[34px] text-white" />
          )}
        </Link>
        {!collapsed && (
          <button
            aria-label="Collapse sidebar"
            className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {collapsed && (
          <button
            aria-label="Expand sidebar"
            className="mt-4 rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>

      <nav className="mt-8 space-y-1">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/62 transition hover:bg-white/5 hover:text-white",
                active && "bg-[#1A56E8] text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="ml-auto rounded-full bg-[#4D7EF5]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8FB0FF]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-[#252528] bg-[#141418] p-3">
        <div className="flex items-center gap-3">
          <Avatar initials={initials} className="h-10 w-10 text-sm shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userEmail}</p>
              <PlanBadge plan={userPlan === "pro" ? "Pro" : "Free"} />
            </div>
          )}
        </div>
        {!collapsed && <div className="mt-3"><LogoutButton /></div>}
      </div>
    </aside>
  );
}
