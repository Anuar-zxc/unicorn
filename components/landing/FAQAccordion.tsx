"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/faq";

export function FAQAccordion() {
  const { locale } = useLanguage();
  const items = FAQ[locale];
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-shell max-w-3xl">
        <div className="text-center">
          <p className="text-caption text-[var(--accent)]">FAQ</p>
          <h2 className="text-h2 mt-3">{locale === "ru" ? "Ответы до того, как вы начнёте." : "Clear answers before you start."}</h2>
        </div>
        <div className="mt-10 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--bg-page)]">
          {items.map((item, index) => {
            const open = active === index;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={`faq-q-${index}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-display font-semibold"
                    onClick={() => setActive(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-a-${index}`}
                  >
                    {item.q}
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open && "rotate-180")} />
                  </button>
                </h3>
                <div
                  id={`faq-a-${index}`}
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  className={cn(
                    "grid transition-all duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-[var(--text-secondary)]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
