import Link from "next/link";
import { ArrowRight, CheckCircle2, ReceiptText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kazakhstan Marketplace Seller Tax Check | Lexo",
  description:
    "A practical tax checklist for Kaspi, Wildberries, OZON, and social-media sellers in Kazakhstan."
};

export default function SellerTaxLandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--border)] pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
          <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-600">
                <ReceiptText className="h-4 w-4" />
                Kazakhstan seller tax assistant
              </span>
              <h1 className="mt-7 font-display text-[clamp(42px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.05em]">
                Selling on Kaspi or Wildberries?
                <span className="block text-[var(--accent)]">Know your tax steps.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
                Kazakhstan rules for online sellers are changing. Get a personalized breakdown of registration, reporting, and questions to verify in about 60 seconds.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="mt-8">
                  Check my tax status — free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-lg)]">
              <h2 className="font-display text-2xl font-semibold">Your report covers</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Whether ИП registration may be required",
                  "Likely tax regime and reporting questions",
                  "VAT and turnover threshold warnings",
                  "Cross-border marketplace considerations",
                  "A practical document and action checklist"
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
