import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const plans = [
  { name: "Solo", price: 49, features: ["All 6 AI tools", "50 documents/month", "100-page reviews", "PDF & DOCX export"] },
  { name: "Firm", price: 149, features: ["Up to 5 team members", "Unlimited documents", "Shared matters", "Priority processing"], featured: true },
  { name: "Enterprise", price: 399, features: ["Unlimited team members", "Custom prompts", "SSO / SAML", "API and SLA"] }
];

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user?.id).maybeSingle();
  const current = profile?.plan ?? "solo";
  return (
    <main className="p-4 md:p-6">
      <p className="text-sm text-white/42">Usage and subscription</p>
      <h1 className="mt-1 font-display text-3xl font-semibold">Billing</h1>
      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {plans.map((plan) => <section key={plan.name} className={`rounded-2xl border bg-[#131720] p-6 ${plan.featured ? "border-[#4d7ef5]" : "border-[#252b36]"}`}><div className="flex items-center justify-between"><p className="font-display text-2xl font-semibold">{plan.name}</p>{current === plan.name.toLowerCase() && <span className="rounded-full bg-[#4d7ef5]/15 px-3 py-1 text-xs font-semibold text-[#8fb0ff]">Current plan</span>}</div><p className="mt-5 font-display text-4xl font-semibold">${plan.price}<span className="text-sm font-normal text-white/40"> / month</span></p><ul className="mt-6 space-y-3 text-sm text-white/62">{plan.features.map((feature) => <li key={feature} className="flex gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{feature}</li>)}</ul><Button className="mt-7 w-full" variant={current === plan.name.toLowerCase() ? "outline" : "primary"} disabled={current === plan.name.toLowerCase()}>{current === plan.name.toLowerCase() ? "Active" : `Choose ${plan.name}`}</Button></section>)}
      </div>
    </main>
  );
}
