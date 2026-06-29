"use client";

import Link from "next/link";
import { ArrowRight, Eye, Plane, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import type { Operator, Trip } from "@vialta/types";
import { TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDuration, formatMoney, formatTime, formatInt } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LivePulse } from "@/components/ui/live-pulse";
import { OperatorLogo } from "./operator-logo";
import { AmenityIcon } from "./amenity-icons";
import { fadeUp } from "@/lib/motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TRIP_TAG_META, tripSignals, type TripTag } from "@/lib/trip-insights";
import { cn } from "@/lib/utils";

export function ResultCard({
  trip,
  operator,
  tags = [],
}: {
  trip: Trip;
  operator?: Operator;
  tags?: TripTag[];
}) {
  const origin = trip.segments[0].origin;
  const destination = trip.segments[trip.segments.length - 1].destination;
  const isBest = tags.includes("best");
  const s = tripSignals(trip);
  const lowSeats = trip.seatsAvailable <= 5;

  // Curaduría: jerarquía clara, una señal por intención.
  // "Más vendido" solo si la opción no ganó ninguna etiqueta comparativa
  // (así evitamos apilar "Recomendado" + "Más vendido" en la misma tarjeta).
  const showBestseller = tags.length === 0 && s.bestseller;

  return (
    <SpotlightCard
      variants={fadeUp}
      spotlightColor={isBest ? "rgba(106, 92, 255, 0.2)" : "rgba(106, 92, 255, 0.14)"}
      className={cn(
        "rounded-3xl border bg-surface p-5 shadow-[var(--shadow-sm)] transition-colors duration-300 hover:shadow-[var(--shadow-md)]",
        isBest
          ? "border-primary/45 ring-1 ring-primary/25"
          : "border-border hover:border-primary/40",
      )}
    >
      {/* Etiquetas: comparativas (decisión) + una señal social/urgencia. */}
      {(tags.length > 0 || showBestseller || lowSeats) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                TRIP_TAG_META[t].className,
              )}
            >
              {t === "best" && <Star className="h-3 w-3 fill-current" />}
              {TRIP_TAG_META[t].label}
            </span>
          ))}
          {showBestseller && <Badge tone="warning">Más vendido</Badge>}
          {lowSeats && (
            <LivePulse tone="danger" className="ml-auto text-danger">
              ¡Solo {trip.seatsAvailable} asientos!
            </LivePulse>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Operador + horario/ruta */}
        <div className="flex flex-1 items-center gap-4">
          {operator && <OperatorLogo operator={operator} />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="truncate font-semibold">{operator?.name ?? "Operador"}</p>
              {operator && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {operator.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="text-center">
                <p className="text-lg font-semibold tabular-nums">{formatTime(trip.departAt)}</p>
                <p className="text-xs text-muted-foreground">{origin.code}</p>
              </div>

              <div className="flex flex-1 flex-col items-center px-1">
                <span className="text-[11px] text-muted-foreground">
                  {formatDuration(trip.totalDurationMin)}
                </span>
                <div className="relative my-1 h-px w-full bg-border">
                  <Plane className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-90 text-primary" />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {trip.stops === 0 ? "Directo" : `${trip.stops} escala${trip.stops > 1 ? "s" : ""}`}
                </span>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold tabular-nums">{formatTime(trip.arriveAt)}</p>
                <p className="text-xs text-muted-foreground">{destination.code}</p>
              </div>
            </div>

            {/* Info útil: clase, equipaje, cancelación + amenities (curado a 4). */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="primary">{TRAVEL_CLASS_LABEL[trip.travelClass]}</Badge>
              {trip.baggageIncluded && <Badge tone="accent">Equipaje incl.</Badge>}
              {s.freeCancellation && (
                <Badge tone="success">
                  <ShieldCheck className="h-3 w-3" />
                  Cancelación gratis
                </Badge>
              )}
              <span className="flex items-center gap-2 text-muted-foreground">
                {trip.amenities.slice(0, 4).map((a) => (
                  <AmenityIcon key={a} amenity={a} />
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Precio + CTA */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-gradient">
              {formatMoney(trip.price.amount, trip.price.currency)}
            </p>
            <p className="text-xs text-muted-foreground">por pasajero</p>
          </div>
          <Link href={`/reserva/${encodeURIComponent(trip.id)}`} className="shrink-0">
            <Button size="md">
              Reservar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Pie de prueba social curado: en vivo + recomendación + verificación. */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        <LivePulse tone="accent">
          <Eye className="h-3.5 w-3.5" />
          {s.viewers} viendo ahora
        </LivePulse>
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5 text-success" />
          {s.satisfaction}% recomienda
        </span>
        <span className="inline-flex items-center gap-1 sm:ml-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          {formatInt(s.reviews)} opiniones verificadas
        </span>
      </div>
    </SpotlightCard>
  );
}
