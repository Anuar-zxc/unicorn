import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  className,
  tone = "blue"
}: {
  initials: string;
  className?: string;
  tone?: "blue" | "green" | "slate" | "violet";
}) {
  const tones = {
    blue: "bg-[var(--accent-light)] text-[var(--accent)]",
    green: "bg-[var(--green-light)] text-[var(--green)]",
    slate: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
    violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300"
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold",
        tones[tone],
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
