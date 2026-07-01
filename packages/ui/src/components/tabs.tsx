"use client";

import { motion } from "framer-motion";
import { cn } from "../lib/cn";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

/** Tabs tipo "pill" con indicador deslizante (layoutId). */
export function Tabs({
  items,
  value,
  onChange,
  layoutId = "tabs-pill",
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  layoutId?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-full border border-border bg-surface-2/70 p-1 text-sm",
        className
      )}
    >
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={cn(
              "relative rounded-full px-4 py-1.5 font-medium transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {it.label}
              {typeof it.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    active ? "bg-white/20" : "bg-surface text-muted-foreground"
                  )}
                >
                  {it.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
