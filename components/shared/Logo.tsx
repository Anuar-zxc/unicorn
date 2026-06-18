import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-[32px] font-bold leading-none tracking-[-0.04em] text-[var(--text-primary)] dark:text-white",
        className
      )}
    >
      <Scale className="h-[.8em] w-[.8em] text-[var(--accent)]" strokeWidth={2.2} />
      {!markOnly && "Lexo"}
    </span>
  );
}
