import { redirect } from "next/navigation";
import { Mail, KeyRound, ShieldAlert } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");
  const email = user.email ?? "";

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">Preferences</p>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
      </div>

      <div className="grid gap-5 max-w-2xl">
        {/* Account section */}
        <section className="rounded-xl border border-[#252528] bg-[#141418] p-6">
          <div className="flex items-center gap-3 mb-5">
            <Mail className="h-5 w-5 text-[#1A56E8]" />
            <h2 className="font-display text-xl font-semibold">Account</h2>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/35 mb-1">Email address</p>
            <p className="text-white/80 text-sm">{email}</p>
          </div>
          <p className="mt-4 text-xs text-white/35">
            To change your email, contact support.
          </p>
        </section>

        {/* Password section */}
        <section className="rounded-xl border border-[#252528] bg-[#141418] p-6">
          <div className="flex items-center gap-3 mb-5">
            <KeyRound className="h-5 w-5 text-[#1A56E8]" />
            <h2 className="font-display text-xl font-semibold">Password</h2>
          </div>
          <p className="text-sm text-white/60 mb-4">
            We will send a password reset link to your email address.
          </p>
          <ResetPasswordButton email={email} />
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-center gap-3 mb-5">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h2 className="font-display text-xl font-semibold text-red-300">Sign out</h2>
          </div>
          <p className="text-sm text-white/50 mb-4">
            This will sign you out of all devices.
          </p>
          <LogoutButton />
        </section>
      </div>
    </main>
  );
}

function ResetPasswordButton({ email }: { email: string }) {
  async function sendReset() {
    "use server";
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServerClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/signin`
    });
  }

  return (
    <form action={sendReset}>
      <button
        type="submit"
        className="rounded-full border border-[#3a3a40] bg-[#0C0C0E] px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition"
      >
        Send password reset email
      </button>
    </form>
  );
}
