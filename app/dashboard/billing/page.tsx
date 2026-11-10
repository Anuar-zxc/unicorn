import { redirect } from "next/navigation";
import { BillingView, type UsageRow } from "@/components/billing/BillingView";
import { featureLimit, normalizePlan } from "@/lib/usage";
import { PLAN_PRODUCTS } from "@/lib/polar";
import { countMonthlyUsage } from "@/lib/usage-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FEATURES: UsageRow["feature"][] = ["analyses", "builds", "questions", "caseStrategies"];

export default async function BillingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin?next=/dashboard/billing");

  const [{ data: profile }, ...counts] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan,subscription_status,current_period_end,cancel_at_period_end")
      .eq("id", user.id)
      .maybeSingle(),
    ...FEATURES.map((feature) => countMonthlyUsage(supabase, user.id, feature))
  ]);

  const current = normalizePlan(profile?.plan);
  const isSubscribed =
    current !== "free" &&
    profile?.subscription_status !== "none" &&
    profile?.subscription_status !== "expired";

  return (
    <BillingView
      current={current}
      status={profile?.subscription_status ?? null}
      periodEnd={profile?.current_period_end ?? null}
      cancelAtPeriodEnd={Boolean(profile?.cancel_at_period_end)}
      isSubscribed={isSubscribed}
      checkoutReady={{ solo: Boolean(PLAN_PRODUCTS.solo), firm: Boolean(PLAN_PRODUCTS.firm) }}
      usage={FEATURES.map((feature, index) => ({
        feature,
        used: counts[index] as number,
        limit: featureLimit(current, feature)
      }))}
      error={params.error}
    />
  );
}
