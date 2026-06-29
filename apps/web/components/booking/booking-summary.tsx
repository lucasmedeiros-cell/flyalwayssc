"use client";

import { ArrowRight, BadgeCheck, CalendarHeart, Lock, ShieldCheck } from "lucide-react";
import type { Operator, Trip } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDuration, formatMoney, formatTime } from "@/lib/utils";
import type { Quote } from "@/lib/booking/config";
import { OperatorLogo } from "@/components/results/operator-logo";

export function BookingSummary({
  trip,
  operator,
  quote,
}: {
  trip: Trip;
  operator: Operator | null;
  quote: Quote;
}) {
  const origin = trip.segments[0].origin;
  const destination = trip.segments[trip.segments.length - 1].destination;
  const meta = TRANSPORT_MODE_META[trip.mode];

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3">
        {operator && <OperatorLogo operator={operator} size={40} />}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{operator?.name ?? "Operador"}</p>
          <p className="text-xs text-muted-foreground">
            {meta.icon} {meta.label} · {TRAVEL_CLASS_LABEL[trip.travelClass]}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-2/60 p-3">
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums">{formatTime(trip.departAt)}</p>
          <p className="text-xs text-muted-foreground">{origin.code}</p>
        </div>
        <div className="flex flex-col items-center px-2 text-muted-foreground">
          <span className="text-[10px]">{formatDuration(trip.totalDurationMin)}</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-[10px]">
            {trip.stops === 0 ? "Directo" : `${trip.stops} escala${trip.stops > 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold tabular-nums">{formatTime(trip.arriveAt)}</p>
          <p className="text-xs text-muted-foreground">{destination.code}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        {quote.lines.map((l, i) => (
          <div key={i} className="flex justify-between gap-2 text-muted-foreground">
            <dt>{l.label}</dt>
            <dd className="tabular-nums">{formatMoney(l.amount, quote.currency)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-2 text-muted-foreground">
          <dt>Impuestos y cargos</dt>
          <dd className="tabular-nums">{formatMoney(quote.taxes, quote.currency)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold">Total</span>
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums">
          {formatMoney(quote.total, quote.currency)}
        </span>
      </div>

      {/* Refuerzo de confianza — visible en todo el checkout para reducir ansiedad de compra. */}
      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
          Precio garantizado durante tu reserva
        </p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 shrink-0 text-success" />
            Pago cifrado de extremo a extremo
          </li>
          <li className="flex items-center gap-1.5">
            <CalendarHeart className="h-3.5 w-3.5 shrink-0 text-success" />
            Cancelación flexible según tarifa
          </li>
          <li className="flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-success" />
            Sin cargos ocultos
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-1.5">
          {["VISA", "Mastercard", "Amex", "QR Simple", "Tigo Money"].map((p) => (
            <span
              key={p}
              className="inline-flex h-6 items-center rounded-md border border-border bg-surface-2/60 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
