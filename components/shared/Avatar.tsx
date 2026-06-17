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
    blue: "bg-[#EEF3FF] text-[#1A56E8]",
    green: "bg-[#E6F7F0] text-[#0D7A4E]",
    slate: "bg-[#F0F0EC] text-[#4A4A48]",
    violet: "bg-violet-100 text-violet-700"
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
