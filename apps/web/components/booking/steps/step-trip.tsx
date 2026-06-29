"use client";

import { Minus, Plus, Clock, Dot } from "lucide-react";
import type { Operator, Trip } from "@vialta/types";
import { TRAVEL_CLASS_LABEL } from "@vialta/types";
import { cn, formatDuration, formatTime } from "@/lib/utils";
import {
  type BookingDraft,
  resizeForPassengers,
  totalPassengers,
} from "@/lib/booking/config";
import { Badge } from "@/components/ui/badge";
import { OperatorLogo } from "@/components/results/operator-logo";
import { AmenityIcon } from "@/components/results/amenity-icons";
import { StepHeading } from "./step-heading";

export function StepTrip({
  trip,
  operator,
  draft,
  onChange,
}: {
  trip: Trip;
  operator: Operator | null;
  draft: BookingDraft;
  onChange: (d: BookingDraft) => void;
}) {
  const setCount = (key: "adults" | "children", delta: number, min: number) => {
    const value = Math.max(min, draft[key] + delta);
    onChange(resizeForPassengers({ ...draft, [key]: value }));
  };

  return (
    <div>
      <StepHeading title="Revisa tu viaje" subtitle="Confirma los detalles y el número de pasajeros." />

      {/* Detalle del viaje */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {operator && <OperatorLogo operator={operator} size={40} />}
            <div>
              <p className="font-semibold">{operator?.name ?? "Operador"}</p>
              <Badge tone="primary" className="mt-1">
                {TRAVEL_CLASS_LABEL[trip.travelClass]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDuration(trip.totalDurationMin)}
          </div>
        </div>

        {/* Segmentos */}
        <ol className="mt-5 space-y-4">
          {trip.segments.map((seg, i) => (
            <li key={seg.id} className="flex gap-4">
              <div className="flex flex-col items-center pt-1">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
                <span className="my-1 w-px flex-1 bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold tabular-nums">{formatTime(seg.departAt)}</p>
                  <p className="text-sm text-muted-foreground">
                    {seg.origin.city} ({seg.origin.code})
                  </p>
                </div>
                <p className="my-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Dot className="h-4 w-4" />
                  {formatDuration(seg.durationMin)} · {seg.vehicleName} · {seg.serviceCode}
                </p>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold tabular-nums">{formatTime(seg.arriveAt)}</p>
                  <p className="text-sm text-muted-foreground">
                    {seg.destination.city} ({seg.destination.code})
                  </p>
                </div>
                {i < trip.segments.length - 1 && (
                  <p className="mt-2 rounded-lg bg-surface-2 px-2 py-1 text-xs text-muted-foreground">
                    Conexión con trasbordo
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Servicios */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-muted-foreground">
          {trip.amenities.map((a) => (
            <span key={a} className="flex items-center gap-1.5 text-xs">
              <AmenityIcon amenity={a} />
            </span>
          ))}
        </div>
      </div>

      {/* Pasajeros */}
      <div className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
        <p className="font-semibold">Pasajeros</p>
        <p className="text-sm text-muted-foreground">Total: {totalPassengers(draft)}</p>
        <div className="mt-4 space-y-3">
          <CounterRow
            label="Adultos"
            hint="13+ años"
            value={draft.adults}
            onDec={() => setCount("adults", -1, 1)}
            onInc={() => setCount("adults", 1, 1)}
            min={1}
          />
          <CounterRow
            label="Niños"
            hint="2–12 años"
            value={draft.children}
            onDec={() => setCount("children", -1, 0)}
            onInc={() => setCount("children", 1, 0)}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}

function CounterRow({
  label,
  hint,
  value,
  onDec,
  onInc,
  min,
}: {
  label: string;
  hint: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  min: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <CounterBtn onClick={onDec} disabled={value <= min} aria-label={`Restar ${label}`}>
          <Minus className="h-4 w-4" />
        </CounterBtn>
        <span className="w-5 text-center text-sm font-semibold tabular-nums">{value}</span>
        <CounterBtn onClick={onInc} aria-label={`Sumar ${label}`}>
          <Plus className="h-4 w-4" />
        </CounterBtn>
      </div>
    </div>
  );
}

function CounterBtn({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
