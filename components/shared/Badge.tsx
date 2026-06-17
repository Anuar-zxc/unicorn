import { cn } from "@/lib/utils";

type BadgeTone = "blue" | "green" | "neutral" | "dark" | "amber";

const tones: Record<BadgeTone, string> = {
  blue: "bg-[#EEF3FF] text-[#1A56E8]",
  green: "bg-[#E6F7F0] text-[#0D7A4E]",
  neutral: "bg-[#F0F0EC] text-[#4A4A48]",
  dark: "bg-[#252528] text-[#F0F0EC]",
  amber: "bg-amber-100 text-amber-700"
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
