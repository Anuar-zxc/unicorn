import { cn } from "@/lib/utils";

type BadgeTone = "blue" | "green" | "neutral" | "dark" | "amber";

const tones: Record<BadgeTone, string> = {
  blue: "bg-[var(--accent-light)] text-[var(--accent)]",
  green: "bg-[var(--green-light)] text-[var(--green)]",
  neutral: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
  dark: "bg-[var(--text-primary)] text-[var(--bg-page)]",
  amber: "bg-[var(--amber-light)] text-[var(--amber)]"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
