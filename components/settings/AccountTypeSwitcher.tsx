"use client";

import { useState } from "react";
import { Scale, UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

export function AccountTypeSwitcher({
  initialType
}: {
  initialType: "lawyer" | "individual";
}) {
  const [accountType, setAccountType] = useState(initialType);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function update(next: "lawyer" | "individual") {
    setSaving(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Please sign in again.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ account_type: next })
      .eq("id", user.id);
    if (error) {
      setMessage(error.message);
    } else {
      setAccountType(next);
      setMessage("Workspace updated. Reloading…");
      window.location.assign("/dashboard");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => update("lawyer")}
          className={cn(
            "rounded-xl border p-4 text-left transition",
            accountType === "lawyer"
              ? "border-[var(--accent)] bg-[var(--accent-light)]"
              : "border-[var(--border)] bg-[var(--bg-page)]"
          )}
        >
          <Scale className="h-5 w-5 text-[var(--accent)]" />
          <p className="mt-3 text-sm font-semibold">Lawyer workspace</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
            Research, drafting, case prep, redlines, and client briefs.
          </p>
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => update("individual")}
          className={cn(
            "rounded-xl border p-4 text-left transition",
            accountType === "individual"
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-[var(--border)] bg-[var(--bg-page)]"
          )}
        >
          <UserRound className="h-5 w-5 text-emerald-500" />
          <p className="mt-3 text-sm font-semibold">Personal workspace</p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
            Contract checks, questions, and marketplace seller taxes.
          </p>
        </button>
      </div>
      {message && <p className="mt-3 text-xs text-[var(--text-secondary)]">{message}</p>}
    </div>
  );
}
