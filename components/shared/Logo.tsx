import { cn } from "@/lib/utils";

export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-[32px] font-bold leading-none tracking-[-0.04em] text-[var(--text-primary)] dark:text-white",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-[.82em] w-[.82em] shrink-0 text-[var(--accent)]"
        fill="none"
      >
        <path
          d="M16 5v19M9 26h14M12 9h8M16 9 8 13m8-4 8 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.7"
        />
        <path
          d="M5.5 13.5h5L8 20l-2.5-6.5ZM21.5 13.5h5L24 20l-2.5-6.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2.7"
        />
        <path
          d="M4 20h8M20 20h8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.7"
        />
      </svg>
      {!markOnly && "Lexo"}
    </span>
  );
}
