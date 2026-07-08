"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Plane,
  Star,
  Tag,
  Ticket,
  CalendarDays,
  Users,
  Wifi,
  Luggage,
  Coffee,
  Tv,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { DESTINATION_IMAGES } from "@/lib/images";
import { useCurrency } from "@/components/common/currency-provider";
import type { TravelPackageDetail } from "@/lib/packages";
import { cn } from "@/lib/utils";

const AMENITIES: { icon: LucideIcon; label: string }[] = [
  { icon: Wifi, label: "Wi-Fi a bordo" },
  { icon: Luggage, label: "Equipaje 23 kg" },
  { icon: Coffee, label: "Snack" },
  { icon: Tv, label: "Entretenimiento" },
];

export function PackageDetail({ pkg }: { pkg: TravelPackageDetail }) {
  const { price } = useCurrency();
  const image = DESTINATION_IMAGES[pkg.imageKey] ?? DESTINATION_IMAGES.Uyuni;

  return (
    <div className="pb-16">
      {/* Cabecera con foto full-bleed */}
      <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage image={image} priority sizes="100vw" imgClassName="scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          <Link
            href="/#ofertas"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a ofertas
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <MapPin className="h-3 w-3" /> Paquete
            </span>
            <span className="rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              {pkg.category}
            </span>
          </div>

          <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight text-white text-on-photo sm:text-6xl">
            {pkg.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90 text-on-photo">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-white/70" /> {pkg.region}
            </span>
            <span className="inline-flex items-center gap-0.5" aria-label={`${pkg.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < pkg.rating ? "fill-warning text-warning" : "text-white/30")} />
              ))}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-white/70" /> {pkg.duration}
            </span>
          </div>
        </div>
      </section>

      {/* Cuerpo: contenido + tarjeta de reserva sticky */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        {/* Columna principal */}
        <div className="min-w-0">
          {/* Intro */}
          <p className="text-balance text-lg leading-relaxed text-muted-foreground">{pkg.tagline}</p>

          {/* Highlights */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pkg.highlights.map((h) => (
              <div key={h} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{h}</span>
              </div>
            ))}
          </div>

          {/* Itinerario */}
          <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">Itinerario</h2>
          <ol className="mt-5 space-y-5">
            {pkg.itinerary.map((it) => (
              <li key={it.day} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {it.day}
                  </span>
                  {it.day !== pkg.itinerary[pkg.itinerary.length - 1].day && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                  )}
                </div>
                <div className="pb-2">
                  <p className="font-semibold">Día {it.day} · {it.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Qué incluye */}
          <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">Qué incluye</h2>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {pkg.included.map((inc) => (
              <li key={inc} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>

          {/* Vuelo */}
          <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">Tu vuelo</h2>
          <div className="mt-5 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cómo llegar</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <Plane className="h-4 w-4 text-muted-foreground" /> Vuelo {pkg.scope === "national" ? "nacional" : "internacional"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Duración</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-muted-foreground" /> {pkg.flightTime}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Aerolínea</p>
                <p className="mt-1 font-semibold">{pkg.airline}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Clase</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Económica
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border pt-5">
              {AMENITIES.map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                  <a.icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] leading-tight text-muted-foreground">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjeta de reserva (sticky en desktop) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-md)]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Desde</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums text-success">
              {price(pkg.priceUSD, "USD")}
            </p>
            <p className="text-xs text-muted-foreground">Vuelo + experiencia, por persona</p>

            <ReserveForm packageName={pkg.name} />

            {/* Acceso opcional al buscador de vuelos, ya de forma intencional. */}
            <Link
              href="/#buscador"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
            >
              <Plane className="h-4 w-4" /> Ver vuelos disponibles
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Formulario de solicitud de reserva (mock, sin backend). Al enviar muestra un
 *  estado de éxito coherente con el Vendedor 24/7. */
function ReserveForm({ packageName }: { packageName: string }) {
  const [sent, setSent] = useState(false);
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("2");
  const [contact, setContact] = useState("");

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 rounded-2xl border border-success/30 bg-success/10 p-4 text-center"
      >
        <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
        <p className="mt-2 text-sm font-semibold text-foreground">¡Solicitud enviada!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Nuestro Vendedor 24/7 te contactará por WhatsApp para confirmar tu paquete a {packageName}.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      className="mt-5 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Fecha de salida
        </span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-2xl border border-input bg-surface px-4 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </label>
      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Pasajeros
        </span>
        <input
          type="number"
          min={1}
          max={20}
          required
          value={pax}
          onChange={(e) => setPax(e.target.value)}
          className="h-11 w-full rounded-2xl border border-input bg-surface px-4 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">WhatsApp o correo</span>
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="+591 7xxxxxxx"
          className="h-11 w-full rounded-2xl border border-input bg-surface px-4 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </label>
      <Button type="submit" size="lg" className="mt-1 w-full">
        <Ticket className="h-4 w-4" /> Reservar este paquete
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">Sin pago ahora · te confirmamos disponibilidad</p>
    </form>
  );
}
