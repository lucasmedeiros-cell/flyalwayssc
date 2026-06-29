"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Gauge, MapPin, Navigation, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { TripTracking, TripTrackingStatus } from "@vialta/types";
import { TRANSPORT_MODE_META, TRIP_TRACKING_LABEL } from "@vialta/types";
import { formatDuration, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/ui/logo-badge";
import { Badge } from "@/components/ui/badge";
import { TripMap } from "./trip-map";

const STATUS_TONE: Record<TripTrackingStatus, "primary" | "accent" | "warning" | "success"> = {
  boarding: "accent",
  in_transit: "primary",
  delayed: "warning",
  arrived: "success",
};

export function TrackingView({ tracking }: { tracking: TripTracking }) {
  const [progress, setProgress] = useState(tracking.progressPct);

  // Avanza el recorrido en vivo mientras está en ruta.
  useEffect(() => {
    if (tracking.status !== "in_transit") return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, +(p + 0.4).toFixed(2)));
    }, 1500);
    return () => clearInterval(id);
  }, [tracking.status]);

  const meta = TRANSPORT_MODE_META[tracking.mode];
  const liveStatus: TripTrackingStatus = progress >= 100 ? "arrived" : tracking.status;
  const arrived = liveStatus === "arrived";
  const moving = liveStatus === "in_transit" || liveStatus === "delayed";

  const totalMin = Math.max(
    1,
    Math.round((new Date(tracking.etaAt).getTime() - new Date(tracking.departAt).getTime()) / 60000)
  );
  const remainingMin = Math.round((1 - progress / 100) * totalMin);
  const distanceRemaining = Math.round((1 - progress / 100) * tracking.distanceTotalKm);

  const nextWaypoint = tracking.waypoints.find((w) => w.atPct > progress);
  const nextStop = arrived
    ? "—"
    : nextWaypoint?.label ?? `${tracking.destinationCity} (${tracking.destinationCode})`;

  const stats = [
    {
      icon: Clock,
      label: "Tiempo restante",
      value: arrived ? "Llegó" : formatDuration(Math.max(0, remainingMin)),
    },
    {
      icon: Navigation,
      label: "Distancia restante",
      value: arrived ? "0 km" : `${distanceRemaining} km`,
    },
    {
      icon: Gauge,
      label: "Velocidad",
      value: moving ? `${tracking.speedKmh} km/h` : "0 km/h",
    },
    { icon: MapPin, label: "Próxima parada", value: nextStop },
  ];

  // Línea de tiempo: origen + waypoints + destino.
  const timeline = [
    { label: `${tracking.originCity} (${tracking.originCode})`, atPct: 0 },
    ...tracking.waypoints.map((w) => ({ label: w.label, atPct: w.atPct })),
    { label: `${tracking.destinationCity} (${tracking.destinationCode})`, atPct: 100 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Mis viajes
        </Link>
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-muted-foreground">
          {tracking.reference}
        </span>
      </div>

      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LogoBadge mark={tracking.operatorMark} color={tracking.operatorColor} size={48} />
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
              {tracking.originCity} → {tracking.destinationCity}
            </h1>
            <p className="text-sm text-muted-foreground">
              {meta.icon} {tracking.operatorName} · {tracking.vehicleName}
            </p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[liveStatus]} className="w-fit px-3 py-1.5 text-sm">
          {TRIP_TRACKING_LABEL[liveStatus]}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Mapa + progreso */}
        <div>
          <TripMap tracking={tracking} progress={progress} />

          <div className="mt-4 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold tabular-nums">{formatTime(tracking.departAt)}</p>
                <p className="text-xs text-muted-foreground">{tracking.originCode} · salida</p>
              </div>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                {Math.round(progress)}%
              </p>
              <div className="text-right">
                <p className="font-semibold tabular-nums">{formatTime(tracking.etaAt)}</p>
                <p className="text-xs text-muted-foreground">{tracking.destinationCode} · llegada</p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 1.4 }}
              />
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {arrived
                ? "El viaje ha finalizado. ¡Buen destino!"
                : moving
                  ? `Llegada estimada en ${formatDuration(Math.max(0, remainingMin))}`
                  : "Embarque en curso. El seguimiento iniciará al partir."}
            </p>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <s.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-semibold tabular-nums">{s.value}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Línea de tiempo */}
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-semibold">Recorrido</h3>
            <ol className="mt-4 space-y-1">
              {timeline.map((stop, i) => {
                const reached = progress >= stop.atPct;
                const current =
                  !reached && progress < stop.atPct && (i === 0 || progress >= timeline[i - 1].atPct);
                return (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px]",
                          reached
                            ? "border-primary bg-primary text-primary-foreground"
                            : current
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground"
                        )}
                      >
                        {reached ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                      </span>
                      {i < timeline.length - 1 && (
                        <span
                          className={cn(
                            "my-0.5 w-0.5 flex-1",
                            progress >= timeline[i + 1].atPct ? "bg-primary" : "bg-border"
                          )}
                          style={{ minHeight: 18 }}
                        />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className={cn("text-sm font-medium", !reached && !current && "text-muted-foreground")}>
                        {stop.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reached ? "Completado" : current ? "En camino" : "Pendiente"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
