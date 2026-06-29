"use client";

import { UtensilsCrossed, ShieldCheck, Zap, Sofa, CalendarClock, Check } from "lucide-react";
import type { Trip } from "@vialta/types";
import {
  type BookingDraft,
  EXTRA_OPTIONS,
  totalPassengers,
} from "@/lib/booking/config";
import { cn, formatMoney } from "@/lib/utils";
import { StepHeading } from "./step-heading";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  meal: UtensilsCrossed,
  insurance: ShieldCheck,
  priority: Zap,
  lounge: Sofa,
  flex: CalendarClock,
};

export function StepExtras({
  trip,
  draft,
  onChange,
}: {
  trip: Trip;
  draft: BookingDraft;
  onChange: (d: BookingDraft) => void;
}) {
  const pax = totalPassengers(draft);
  const currency = trip.price.currency;

  const toggle = (id: string) => {
    const set = new Set(draft.extras);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...draft, extras: Array.from(set) });
  };

  return (
    <div>
      <StepHeading
        title="Servicios adicionales"
        subtitle="Mejora tu experiencia. Puedes añadir o quitar lo que quieras."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {EXTRA_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.id] ?? Check;
          const active = draft.extras.includes(opt.id);
          const price = opt.perPassenger ? opt.price * pax : opt.price;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              aria-pressed={active}
              className={cn(
                "flex items-start gap-4 rounded-3xl border p-5 text-left transition-all",
                active
                  ? "border-primary bg-primary/8 shadow-[var(--shadow-sm)]"
                  : "border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{opt.label}</p>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{opt.description}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  +{formatMoney(price, currency)}
                  {opt.perPassenger && <span className="font-normal text-muted-foreground"> · por reserva</span>}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
