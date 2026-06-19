"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [activating, setActivating] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActivating(false);
      router.refresh();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="grid min-h-[70vh] place-items-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-[#252b36] bg-[#131720] p-8 text-center">
        {activating ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#8fb0ff]" />
            <h1 className="mt-5 font-display text-2xl font-semibold">
              Activating your plan…
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Polar confirmed the payment. Lexo is syncing your subscription.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
            <h1 className="mt-5 font-display text-2xl font-semibold">
              You&apos;re all set
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Your subscription is active and your plan limits have been updated.
            </p>
            <Link href="/dashboard">
              <Button className="mt-6">Go to workspace</Button>
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
