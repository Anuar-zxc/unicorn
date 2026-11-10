"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/components/providers/AppProviders";

export type LegalSection = { title: string; body: string[] };
export type LegalContent = {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

/** Bilingual legal page that follows the site language switch and both themes. */
export function LegalDocument({ ru, en }: { ru: LegalContent; en: LegalContent }) {
  const { locale } = useLanguage();
  const content = locale === "ru" ? ru : en;

  return (
    <>
      <Navbar />
      <main id="main" className="container-shell py-32">
        <article className="max-w-3xl">
          <h1 className="font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight tracking-[-0.03em]">
            {content.title}
          </h1>
          <p className="mt-4 text-sm text-[var(--text-muted)]">{content.updated}</p>
          {content.intro && (
            <p className="mt-8 text-base leading-7 text-[var(--text-secondary)]">{content.intro}</p>
          )}
          <div className="mt-10 space-y-9">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-7 text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
