"use client";

import { Briefcase, Luggage, Minus, Plus, Check } from "lucide-react";
import type { Trip } from "@vialta/types";
import {
  type BookingDraft,
  CHECKED_BAG_PRICE,
  totalPassengers,
} from "@/lib/booking/config";
import { cn, formatMoney } from "@/lib/utils";
import { StepHeading } from "./step-heading";

export function StepBaggage({
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

  const setBags = (index: number, delta: number) => {
    const checkedBags = draft.checkedBags.map((b, i) =>
      i === index ? Math.max(0, Math.min(3, b + delta)) : b
    );
    onChange({ ...draft, checkedBags });
  };

  return (
    <div>
      <StepHeading
        title="Equipaje"
        subtitle="El equipaje de mano está incluido. Añade maletas facturadas si las necesitas."
      />

      <div className="space-y-4">
        {Array.from({ length: pax }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
          >
            <p className="font-semibold">
              Pasajero {i + 1}
              {draft.passengers[i]?.firstName && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {draft.passengers[i].firstName} {draft.passengers[i].lastName}
                </span>
              )}
            </p>

            <div className="mt-4 space-y-3">
              {/* Equipaje de mano incluido */}
              <div className="flex items-center justify-between rounded-2xl bg-surface-2/50 px-4 py-3">
                <span className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Equipaje de mano</span>
                    <span className="block text-xs text-muted-foreground">1 pieza · hasta 10 kg</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                  <Check className="h-4 w-4" /> Incluido
                </span>
              </div>

              {/* Equipaje facturado */}
              <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <span className="flex items-center gap-3 text-sm">
                  <Luggage className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Maleta facturada</span>
                    <span className="block text-xs text-muted-foreground">
                      hasta 23 kg · {formatMoney(CHECKED_BAG_PRICE, currency)} c/u
                    </span>
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <BagBtn onClick={() => setBags(i, -1)} disabled={draft.checkedBags[i] <= 0}>
                    <Minus className="h-4 w-4" />
                  </BagBtn>
                  <span className="w-5 text-center text-sm font-semibold tabular-nums">
                    {draft.checkedBags[i]}
                  </span>
                  <BagBtn onClick={() => setBags(i, 1)} disabled={draft.checkedBags[i] >= 3}>
                    <Plus className="h-4 w-4" />
                  </BagBtn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BagBtn({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}
