"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const ru = locale === "ru";
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
      <section className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--bg-page)] p-8 text-center shadow-[var(--shadow-md)]" role="status" aria-live="polite">
        {activating ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[var(--accent)]" aria-hidden />
            <h1 className="mt-5 font-display text-2xl font-bold">{ru ? "Активируем тариф…" : "Activating your plan…"}</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {ru ? "Оплата подтверждена. Lexo синхронизирует подписку." : "Payment confirmed. Lexo is syncing your subscription."}
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--green)]" aria-hidden />
            <h1 className="mt-5 font-display text-2xl font-bold">{ru ? "Готово!" : "You’re all set"}</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {ru ? "Подписка активна, лимиты тарифа обновлены." : "Your subscription is active and your plan limits have been updated."}
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard">{ru ? "Перейти в кабинет" : "Go to workspace"}</Link>
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
