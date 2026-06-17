"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { pricing } from "@/lib/data";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="bg-[#F8F8F6] py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[#1A56E8]">Pricing</p>
          <h2 className="text-h2 mt-3">Predictable legal protection for every stage.</h2>
          <div className="mt-7 inline-flex rounded-full border border-[var(--border-token)] bg-white p-1">
            <button
              className={cn("rounded-full px-5 py-2 text-sm font-semibold transition", !annual && "bg-[#1A56E8] text-white")}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={cn("rounded-full px-5 py-2 text-sm font-semibold transition", annual && "bg-[#1A56E8] text-white")}
              onClick={() => setAnnual(true)}
            >
              Annual -20%
            </button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricing.map((plan) => {
            const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
            return (
              <article
                key={plan.name}
                className={cn(
                  "relative rounded-[8px] border bg-white p-6 shadow-soft transition hover:-translate-y-0.5",
                  plan.popular ? "border-[#1A56E8] shadow-deep" : "border-[var(--border-token)]"
                )}
              >
                {plan.popular && <Badge tone="blue" className="absolute right-5 top-5">Most popular</Badge>}
                <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[#4A4A48]">{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">${price}</span>
                  <span className="pb-2 text-[#4A4A48]">/mo</span>
                </div>
                <Button className="mt-6 w-full">Start free 14-day trial</Button>
                <ul className="mt-6 space-y-3 text-sm text-[#4A4A48]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-[#0D7A4E]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-[#4A4A48]">
          No credit card required · Cancel anytime · SOC2 compliant
        </p>
      </div>
    </section>
  );
}
