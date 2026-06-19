import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UpgradePrompt({ feature }: { feature: string }) {
  return (
    <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-center">
      <p className="text-sm font-medium text-amber-100">
        You&apos;ve reached your {feature} limit for this month.
      </p>
      <Link href="/dashboard/billing">
        <Button className="mt-3" size="sm">
          Upgrade plan →
        </Button>
      </Link>
    </div>
  );
}
