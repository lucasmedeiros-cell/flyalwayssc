"use client";

import { motion } from "framer-motion";
import { Plane, Bus, TrainFront, Car, type LucideIcon } from "lucide-react";
import type { TransportMode } from "@vialta/types";
import { TRANSPORT_MODES, TRANSPORT_MODE_META } from "@vialta/types";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Iconografía unificada del buscador (una sola familia: Lucide, mismo grosor y
 * tamaño). Reemplaza los emojis para una apariencia premium y consistente.
 */
export const MODE_ICON: Record<TransportMode, LucideIcon> = {
  air: Plane,
  bus: Bus,
  train: TrainFront,
  private: Car,
};

export function TransportTabs({
  value,
  onChange,
  className,
}: {
  value: TransportMode;
  onChange: (mode: TransportMode) => void;
  className?: string;
}) {
  // Plataforma de un solo modo (solo vuelos): chip estático en vez de pestañas.
  if (TRANSPORT_MODES.length <= 1) {
    const only = TRANSPORT_MODES[0];
    const OnlyIcon = MODE_ICON[only];
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface-2/70 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm",
          className,
        )}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
          <OnlyIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
        {TRANSPORT_MODE_META[only].label}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label="Tipo de transporte"
      className={cn(
        "flex w-full gap-1 rounded-full border border-border bg-surface-2/70 p-1.5 backdrop-blur-sm sm:w-auto",
        className,
      )}
    >
      {TRANSPORT_MODES.map((mode) => {
        const meta = TRANSPORT_MODE_META[mode];
        const Icon = MODE_ICON[mode];
        const active = value === mode;
        return (
          <motion.button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={meta.label}
            onClick={() => onChange(mode)}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "relative flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-200 sm:flex-none sm:px-4",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface-2",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="transport-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-strong shadow-[var(--shadow-glow)]"
                transition={SPRING_SOFT}
              />
            )}
            <motion.span
              className="relative z-10 flex"
              animate={active ? { scale: 1.1 } : { scale: 1 }}
              transition={SPRING_SOFT}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </motion.span>
            <span className="relative z-10 hidden sm:inline">{meta.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
