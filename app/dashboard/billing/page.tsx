import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_MONTHLY_LIMIT } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user?.id)
    .maybeSingle();

  const { count } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .gte("created_at", monthStart.toISOString());

  const plan = profile?.plan ?? "free";

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">Usage and plan</p>
        <h1 className="font-display text-3xl font-semibold">Billing</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border border-[#252528] bg-[#141418] p-6">
          <p className="text-sm text-white/42">Current plan</p>
          <h2 className="mt-3 font-display text-4xl font-semibold capitalize">{plan}</h2>
          <p className="mt-3 text-white/50">
            {plan === "pro"
              ? "Unlimited contract analyses are enabled."
              : `${count ?? 0} of ${FREE_MONTHLY_LIMIT} free analyses used this month.`}
          </p>
        </section>
        <section className="rounded-xl border border-[#1A56E8] bg-[#141418] p-6">
          <p className="text-sm text-white/42">Pro</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">$9/month</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {["Unlimited analyses", "Previous reports", "Secure file storage", "Cancel anytime"].map((feature) => (
              <li key={feature} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0D7A4E]" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/api/stripe/checkout">
            <Button className="mt-6 w-full">Upgrade to Pro</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
