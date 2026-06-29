"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { BOOKING_STEPS } from "@vialta/types";
import { cn } from "@/lib/utils";

export function Stepper({ current }: { current: number }) {
  const total = BOOKING_STEPS.length;
  const pct = (current / (total - 1)) * 100;

  return (
    <div>
      {/* Móvil: progreso compacto */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            Paso {current + 1} de {total}
          </span>
          <span className="text-sm text-muted-foreground">{BOOKING_STEPS[current].label}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop: línea con nodos */}
      <div className="relative hidden sm:block">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-surface-2" />
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-primary"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol className="relative flex justify-between">
          {BOOKING_STEPS.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={step.key} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold transition-colors",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary text-primary",
                    !done && !active && "border-border text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "max-w-20 text-center text-[11px] font-medium leading-tight",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
