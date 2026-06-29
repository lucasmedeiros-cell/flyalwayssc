"use client";

import Link from "next/link";
import { Check, Download, Ticket, Plane } from "lucide-react";
import { motion } from "framer-motion";
import type { Operator, Trip } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { type BookingDraft, type Quote, totalPassengers } from "@/lib/booking/config";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import { OperatorLogo } from "@/components/results/operator-logo";
import { Button } from "@/components/ui/button";

export function StepConfirmation({
  trip,
  operator,
  draft,
  reference,
  quote,
}: {
  trip: Trip;
  operator: Operator | null;
  draft: BookingDraft;
  reference: string;
  quote: Quote;
}) {
  const origin = trip.segments[0].origin;
  const destination = trip.segments[trip.segments.length - 1].destination;
  const meta = TRANSPORT_MODE_META[trip.mode];
  const pax = totalPassengers(draft);
  const lead = draft.passengers[0];

  return (
    <div className="mx-auto max-w-xl text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success"
      >
        <Check className="h-10 w-10" strokeWidth={3} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl"
      >
        ¡Reserva confirmada!
      </motion.h2>
      <p className="mt-2 text-muted-foreground">
        Enviamos los detalles a{" "}
        <span className="font-medium text-foreground">{lead?.email || "tu correo"}</span>.
      </p>

      {/* Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-surface text-left shadow-[var(--shadow-md)]"
      >
        <div className="bg-aurora p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {operator && <OperatorLogo operator={operator} size={40} />}
              <div>
                <p className="font-semibold">{operator?.name ?? "Operador"}</p>
                <p className="text-xs text-muted-foreground">
                  {meta.icon} {meta.label} · {TRAVEL_CLASS_LABEL[trip.travelClass]}
                </p>
              </div>
            </div>
            <Ticket className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Perforación */}
        <div className="relative flex items-center justify-between border-y border-dashed border-border px-5 py-4">
          <span className="absolute -left-3 h-6 w-6 rounded-full bg-background" />
          <span className="absolute -right-3 h-6 w-6 rounded-full bg-background" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{formatTime(trip.departAt)}</p>
            <p className="text-xs text-muted-foreground">
              {origin.city} · {origin.code}
            </p>
          </div>
          <Plane className="h-5 w-5 rotate-90 text-primary" />
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{formatTime(trip.arriveAt)}</p>
            <p className="text-xs text-muted-foreground">
              {destination.city} · {destination.code}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4">
          <Info label="Código" value={reference} />
          <Info label="Fecha" value={formatDate(trip.departAt)} />
          <Info label="Pasajeros" value={String(pax)} />
          <Info
            label="Asientos"
            value={
              draft.seatIds.length
                ? draft.seatIds.map((id) => id.split("-").pop()).join(", ")
                : "—"
            }
          />
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-5 py-4">
          <span className="text-sm text-muted-foreground">Total pagado</span>
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums">
            {formatMoney(quote.total, quote.currency)}
          </span>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          <Download className="h-4 w-4" />
          Descargar ticket
        </Button>
        <Link href="/perfil">
          <Button size="lg" className="w-full sm:w-auto">
            Ver mis viajes
          </Button>
        </Link>
      </div>
      <Link
        href="/"
        className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}
