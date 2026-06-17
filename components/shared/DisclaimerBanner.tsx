import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function DisclaimerBanner({
  className,
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900",
        compact ? "p-3 text-sm" : "p-4 text-sm leading-6",
        className
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        AI responses and generated documents are for informational purposes only
        and do not constitute legal advice. Consult a licensed attorney before
        making binding decisions.
      </p>
    </div>
  );
}
