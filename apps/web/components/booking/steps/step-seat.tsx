"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Seat, SeatMapLayout, Trip } from "@vialta/types";
import { cn, formatMoney } from "@/lib/utils";
import { type BookingDraft, totalPassengers } from "@/lib/booking/config";
import { StepHeading } from "./step-heading";

export function StepSeat({
  trip,
  seatMap,
  draft,
  onChange,
}: {
  trip: Trip;
  seatMap: SeatMapLayout | null;
  draft: BookingDraft;
  onChange: (d: BookingDraft) => void;
}) {
  const pax = totalPassengers(draft);
  const selected = new Set(draft.seatIds);

  const rows = useMemo(() => {
    if (!seatMap) return [];
    const byRow = new Map<number, Seat[]>();
    for (const s of seatMap.seats) {
      if (!byRow.has(s.row)) byRow.set(s.row, []);
      byRow.get(s.row)!.push(s);
    }
    return Array.from(byRow.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([row, seats]) => ({
        row,
        seats: seatMap.columns.map((c) => seats.find((s) => s.col === c)!),
      }));
  }, [seatMap]);

  const toggle = (seat: Seat) => {
    if (seat.status === "occupied") return;
    const next = new Set(draft.seatIds);
    if (next.has(seat.id)) {
      next.delete(seat.id);
    } else {
      if (next.size >= pax) {
        // Reemplaza el primero seleccionado cuando ya está completo.
        const first = draft.seatIds[0];
        next.delete(first);
      }
      next.add(seat.id);
    }
    onChange({ ...draft, seatIds: Array.from(next) });
  };

  if (!seatMap) {
    return (
      <div>
        <StepHeading title="Elige tus asientos" />
        <div className="h-80 animate-pulse rounded-3xl border border-border bg-surface" />
      </div>
    );
  }

  const selectedSeats = seatMap.seats.filter((s) => selected.has(s.id));

  return (
    <div>
      <StepHeading
        title="Elige tus asientos"
        subtitle={`Selecciona ${pax} asiento${pax > 1 ? "s" : ""}. Los marcados con precio tienen recargo.`}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        {/* Mapa */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
          <div className="mx-auto max-w-md">
            <div className="mb-4 flex items-center justify-center">
              <span className="rounded-full bg-surface-2 px-4 py-1 text-xs font-medium text-muted-foreground">
                {seatMap.deckLabel ?? "Frente"} · frente del vehículo
              </span>
            </div>

            {/* Cabecera de columnas */}
            <div className="mb-2 flex justify-center gap-1.5">
              {seatMap.columns.map((c, i) => (
                <SeatHeaderCell key={c} letter={c} aisleAfter={seatMap.aisleAfter.includes(i)} />
              ))}
            </div>

            <div className="space-y-1.5">
              {rows.map(({ row, seats }) => (
                <div key={row} className="flex items-center justify-center gap-1.5">
                  {seats.map((seat, i) => (
                    <SeatCell
                      key={seat.id}
                      seat={seat}
                      selected={selected.has(seat.id)}
                      aisleAfter={seatMap.aisleAfter.includes(i)}
                      currency={trip.price.currency}
                      onClick={() => toggle(seat)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Leyenda */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <Legend className="border-border bg-surface" label="Disponible" />
            <Legend className="border-primary bg-primary" label="Seleccionado" />
            <Legend className="border-transparent bg-surface-2" label="Ocupado" />
            <Legend className="border-accent bg-accent/15" label="Premium" />
          </div>
        </div>

        {/* Resumen de selección */}
        <div className="md:w-56">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <p className="text-sm font-semibold">
              Asientos ({selectedSeats.length}/{pax})
            </p>
            <div className="mt-3 space-y-2">
              {selectedSeats.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no has elegido asiento.</p>
              )}
              {selectedSeats.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-xl bg-surface-2/60 px-3 py-2 text-sm"
                >
                  <span className="font-semibold tabular-nums">{s.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.surcharge ? `+${formatMoney(s.surcharge.amount, s.surcharge.currency)}` : "Incluido"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeatHeaderCell({ letter, aisleAfter }: { letter: string; aisleAfter: boolean }) {
  return (
    <>
      <span className="flex h-5 w-9 items-center justify-center text-[11px] font-medium text-muted-foreground">
        {letter}
      </span>
      {aisleAfter && <span className="w-5" aria-hidden />}
    </>
  );
}

function SeatCell({
  seat,
  selected,
  aisleAfter,
  currency,
  onClick,
}: {
  seat: Seat;
  selected: boolean;
  aisleAfter: boolean;
  currency: string;
  onClick: () => void;
}) {
  const occupied = seat.status === "occupied";
  const premium = !!seat.surcharge;
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={occupied}
        aria-label={`Asiento ${seat.label}${occupied ? " (ocupado)" : ""}`}
        aria-pressed={selected}
        title={
          occupied
            ? "Ocupado"
            : premium
              ? `Premium · +${formatMoney(seat.surcharge!.amount, currency)}`
              : seat.label
        }
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg border text-[10px] font-semibold transition-all",
          occupied && "cursor-not-allowed border-transparent bg-surface-2 text-transparent",
          !occupied && !selected && !premium && "border-border bg-surface hover:border-primary hover:-translate-y-0.5",
          !occupied && !selected && premium && "border-accent/60 bg-accent/12 text-accent-strong hover:-translate-y-0.5 dark:text-accent",
          selected && "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
        )}
      >
        {selected ? "✓" : occupied ? "" : seat.label.replace(/^\d+/, "")}
      </button>
      {aisleAfter && <span className="w-5" aria-hidden />}
    </>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-4 w-4 rounded border", className)} />
      {label}
    </span>
  );
}
