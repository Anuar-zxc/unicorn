"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

export function UpgradePrompt() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  return (
    <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-center">
      <p className="text-sm font-medium">
        {ru ? "Лимит на этот месяц исчерпан. Лимиты обновляются 1-го числа." : "You've used this month's limit. Limits reset on the 1st."}
      </p>
      <Button asChild className="mt-3" size="sm">
        <Link href="/dashboard/billing">{ru ? "Посмотреть тарифы →" : "See plans →"}</Link>
      </Button>
    </div>
  );
}
