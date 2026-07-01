"use client";

import { forwardRef } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "glass" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-full " +
  "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 " +
  "active:scale-[0.97] select-none";

const variants: Record<Variant, string> = {
  primary:
    "btn-shine bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary-strong hover:-translate-y-0.5",
  accent: "btn-shine bg-accent text-accent-foreground hover:bg-accent-strong shadow-[var(--shadow-md)] hover:-translate-y-0.5",
  outline: "border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-primary/40",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
  glass: "glass text-foreground hover:shadow-[var(--shadow-md)]",
  danger: "bg-danger text-white hover:brightness-110 shadow-[var(--shadow-md)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "h-11 w-11 p-0",
};

/**
 * Clases del botón reutilizables para renderizar otros elementos (p. ej. un
 * `<a>` con apariencia de botón) sin anidar un `<button>` dentro de un `<a>`.
 */
export function buttonClasses(opts?: { variant?: Variant; size?: Size; className?: string }) {
  const { variant = "primary", size = "md", className } = opts ?? {};
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = "Button";
