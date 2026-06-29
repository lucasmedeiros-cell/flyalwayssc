"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onChange,
  label,
  hint,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-2",
        className
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface"
          )}
        >
          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </span>
        <span className="text-sm text-foreground">{label}</span>
      </span>
      {hint != null && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
