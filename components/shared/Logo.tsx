import { cn } from "@/lib/utils";

export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span
      className={cn(
        "font-display text-[32px] font-extrabold lowercase leading-none tracking-normal text-[var(--text-primary)] dark:text-white",
        className
      )}
    >
      {markOnly ? "lx" : "lexo"}
    </span>
  );
}
