"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-[#F8F8F6] py-20 md:py-28">
      <div className="container-shell max-w-3xl">
        <div className="text-center">
          <p className="text-caption text-[#1A56E8]">FAQ</p>
          <h2 className="text-h2 mt-3">Clear answers before you start.</h2>
        </div>
        <div className="mt-10 divide-y divide-[var(--border-token)] rounded-[8px] border border-[var(--border-token)] bg-white">
          {faq.map((item, index) => (
            <div key={item.q}>
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-display font-semibold"
                onClick={() => setActive(active === index ? null : index)}
                aria-expanded={active === index}
              >
                {item.q}
                <ChevronDown className={cn("h-5 w-5 transition", active === index && "rotate-180")} />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  active === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-6 text-[#4A4A48]">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
