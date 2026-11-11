"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

/** Accessible two/three-way switch (radiogroup) used for answer style and language. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  disabled
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-surface)] p-1 text-xs"
    >
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)] disabled:cursor-wait",
              active && "bg-[var(--bg-page)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
