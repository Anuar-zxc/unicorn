"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/AppProviders";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const { locale } = useLanguage();
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" />
      {locale === "ru" ? "Выйти" : "Log out"}
    </button>
  );
}
