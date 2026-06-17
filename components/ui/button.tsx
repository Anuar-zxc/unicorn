import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--accent-hover)] active:scale-[0.97]",
  secondary:
    "bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--bg-elevated)] active:scale-[0.97]",
  ghost:
    "bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.97]",
  dark:
    "bg-[var(--text-primary)] text-[var(--bg-page)] hover:opacity-90 active:scale-[0.97]",
  outline:
    "border border-[var(--border)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)] active:scale-[0.97]"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-4 text-sm",
  md: "h-11 rounded-full px-5 text-sm",
  lg: "h-12 rounded-full px-6 text-base",
  icon: "h-10 w-10 rounded-full"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "focus-ring relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
