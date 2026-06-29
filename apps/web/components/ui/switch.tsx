"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
  icon,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-2",
        className
      )}
    >
      <span className="flex items-center gap-2.5 text-sm text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          checked ? "bg-primary" : "bg-surface-2 border border-border"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
