import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizePlan } from "@/lib/usage";
import { PLAN_PRODUCTS } from "@/lib/polar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const plans = [
  {
    key: "solo",
    name: "Solo",
    price: 49,
    featured: false,
    features: [
      "All 6 AI tools",
      "50 documents/month",
      "100-page reviews",
      "PDF & DOCX export"
    ]
  },
  {
    key: "firm",
    name: "Firm",
    price: 149,
    features: [
      "Up to 5 team members",
      "Unlimited documents",
      "Shared matters",
      "Priority processing"
    ],
    featured: true
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 399,
    featured: false,
    features: [
      "Unlimited team members",
      "Custom prompts",
      "SSO / SAML",
      "API and SLA"
    ]
  }
] as const;

const planNames = {
  free: "Free",
  solo: "Solo",
  firm: "Firm",
  enterprise: "Enterprise"
};

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

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "plan,subscription_status,current_period_end,cancel_at_period_end,polar_customer_id"
    )
    .eq("id", user.id)
    .maybeSingle();

  const current = normalizePlan(profile?.plan);
  const isSubscribed =
    current !== "free" &&
    profile?.subscription_status !== "none" &&
    profile?.subscription_status !== "expired";

  return (
    <main className="p-4 md:p-6">
      <p className="text-sm text-white/42">Usage and subscription</p>
      <h1 className="mt-1 font-display text-3xl font-semibold">Billing</h1>

      {params.error && (
        <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          {params.error === "polar_not_configured"
            ? "Polar sandbox is not configured yet. Add the access token and product IDs."
            : params.error === "no_subscription"
              ? "No active Polar subscription was found. Choose a plan below first."
            : "We could not open this billing flow. Please try again."}
        </p>
      )}

      <section className="mt-6 rounded-2xl border border-[#252b36] bg-[#131720] p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#8fb0ff]" />
              <p className="text-sm text-white/45">Current plan</p>
              {profile?.subscription_status === "active" && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  Active
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">
              {planNames[current]}
            </p>
            {profile?.cancel_at_period_end && profile.current_period_end && (
              <p className="mt-2 text-sm text-amber-200/80">
                Access remains active until{" "}
                {new Date(profile.current_period_end).toLocaleDateString()}.
              </p>
            )}
          </div>
          {isSubscribed && (
            <Link href="/api/portal">
              <Button variant="outline">
                Manage billing <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {plans.map((plan) => {
          const active = current === plan.key;
          const checkoutReady =
            plan.key === "solo"
              ? Boolean(PLAN_PRODUCTS.solo)
              : plan.key === "firm"
                ? Boolean(PLAN_PRODUCTS.firm)
                : true;
          const href =
            plan.key === "enterprise"
              ? "mailto:sales@lexo.ai?subject=Lexo Enterprise"
              : isSubscribed
                ? "/api/portal"
                : `/api/checkout?plan=${plan.key}`;

          return (
            <section
              key={plan.name}
              className={`rounded-2xl border bg-[#131720] p-6 ${
                plan.featured ? "border-[#4d7ef5]" : "border-[#252b36]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl font-semibold">{plan.name}</p>
                {active && (
                  <span className="rounded-full bg-[#4d7ef5]/15 px-3 py-1 text-xs font-semibold text-[#8fb0ff]">
                    Current plan
                  </span>
                )}
              </div>
              <p className="mt-5 font-display text-4xl font-semibold">
                ${plan.price}
                <span className="text-sm font-normal text-white/40">
                  {" "}
                  / month
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/62">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              {active ? (
                <Button className="mt-7 w-full" variant="outline" disabled>
                  Active
                </Button>
              ) : (
                <Link href={checkoutReady ? href : "/dashboard/billing?error=polar_not_configured"}>
                  <Button
                    className="mt-7 w-full"
                    variant={plan.featured ? "primary" : "outline"}
                  >
                    {plan.key === "enterprise" ? "Contact sales" : `Choose ${plan.name}`}
                  </Button>
                </Link>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
