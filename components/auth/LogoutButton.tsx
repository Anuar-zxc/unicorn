"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/5 hover:text-white"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
