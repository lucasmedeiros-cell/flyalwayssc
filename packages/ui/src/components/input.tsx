"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

const fieldBase =
  "h-11 w-full rounded-2xl border border-input bg-surface px-4 text-sm text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors outline-none " +
  "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 " +
  "disabled:opacity-50 disabled:pointer-events-none";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icono opcional a la izquierda. */
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    if (!Icon) {
      return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
    }
    return (
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input ref={ref} className={cn(fieldBase, "pl-10", className)} {...props} />
      </div>
    );
  }
);
Input.displayName = "Input";

/** Etiqueta de campo estandarizada. */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

/** Campo completo: label + control + hint/error. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
