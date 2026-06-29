"use client";

import { cn } from "@/lib/utils";

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary/12 text-primary"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
