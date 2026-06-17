"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Avatar } from "@/components/shared/Avatar";

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
  userPlan
}: {
  children: React.ReactNode;
  userEmail: string;
  userPlan: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const initials = getInitials(userEmail || "CL");

  return (
    <div className="dark-shell min-h-screen lg:flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        userEmail={userEmail}
        userPlan={userPlan}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-[#252528] bg-[#0C0C0E]/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-4 md:px-6">
            <button
              className="rounded-full p-2 text-white/70 hover:bg-white/5 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setCollapsed((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                Contract clarity
              </p>
              <p className="font-display text-xl font-semibold">Lexo</p>
            </div>
            <div className="ml-auto">
              <Avatar initials={initials} className="h-10 w-10 text-sm" />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
