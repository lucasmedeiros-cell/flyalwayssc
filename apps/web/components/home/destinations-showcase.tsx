"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Plane,
  Ticket,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Wifi,
  Luggage,
  Coffee,
  Tv,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { DESTINATION_IMAGES } from "@/lib/images";
import { NATIONAL, INTERNATIONAL, FLIGHT_INFO, type Destination } from "@/lib/destinations";
import { useCurrency } from "@/components/common/currency-provider";

type Scope = "national" | "international";

const FLIGHT_AMENITIES: { icon: LucideIcon; label: string }[] = [
  { icon: Wifi, label: "Wi-Fi a bordo" },
  { icon: Luggage, label: "Equipaje 23 kg" },
  { icon: Coffee, label: "Snack" },
  { icon: Tv, label: "Entretenimiento" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{children}</p>
  );
}

export function DestinationsShowcase() {
  const { price } = useCurrency();
  const [scope, setScope] = useState<Scope>("national");
  const [i, setI] = useState(0);

  const list = useMemo(() => (scope === "national" ? NATIONAL : INTERNATIONAL), [scope]);
  const d: Destination = list[i] ?? list[0];
  const flight = FLIGHT_INFO[d.name] ?? {
    airline: scope === "national" ? "Boliviana de Aviación" : "LATAM Airlines",
    time: scope === "national" ? "≈ 1h" : "Vuelo directo",
  };

  const setScopeReset = (s: Scope) => {
    setScope(s);
    setI(0);
  };
  const go = (dir: number) => setI((v) => (v + dir + list.length) % list.length);

  return (
    <section
      id="destinos"
      className="relative isolate flex min-h-[calc(100vh-4rem)] scroll-mt-20 flex-col justify-center overflow-hidden bg-slate-950"
    >
      {/* Foto del destino a todo lo ancho (full-bleed, como el hero). */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scope}-${i}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <SmartImage image={DESTINATION_IMAGES[d.imageKey]} priority sizes="100vw" imgClassName="scale-105" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-y-0 left-0 hidden w-[40%] bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-gradient-to-l from-slate-950 via-slate-950/85 to-transparent lg:block" />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-slate-950/55 lg:hidden" />
        {/* Fundidos de borde: mezclan esta sección oscura con las zonas CLARAS
            contiguas (producto destacado arriba, ofertas abajo) para que la
            costura no se note. Usan `background` → en modo claro funden a claro
            y en modo oscuro son casi imperceptibles. El contenido va centrado,
            así que estos fundidos no tocan el texto. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent sm:h-40" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent sm:h-40" aria-hidden />
      </div>

      {/* Flechas en los bordes */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Destino anterior"
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 lg:inline-flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Destino siguiente"
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 lg:inline-flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6 lg:px-12">
        {/* Encabezado + toggle (sobre la imagen) */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            Destinos de ensueño
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-4xl">
            Elige a dónde{" "}
            <span className="bg-gradient-to-r from-[#c3b9ff] to-[#5b9dff] bg-clip-text text-transparent">volar</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-base">
            Vuelos a los mejores destinos, dentro y fuera de Bolivia. Elige el tuyo y reserva en minutos.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setScopeReset("national")}
              className={
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors " +
                (scope === "national" ? "bg-white text-slate-900" : "text-white/75 hover:text-white")
              }
            >
              🇧🇴 Nacionales
            </button>
            <button
              type="button"
              onClick={() => setScopeReset("international")}
              className={
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors " +
                (scope === "international" ? "bg-white text-slate-900" : "text-white/75 hover:text-white")
              }
            >
              <Globe className="h-4 w-4" /> Internacionales
            </button>
          </div>
        </div>

        {/* 3 columnas: destino · foto (centro) · vuelo */}
        <div className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)_minmax(0,270px)] lg:gap-6">
          {/* Izquierda: detalles del destino */}
          <motion.div
            key={`l-${scope}-${i}`}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 text-white"
          >
            <div>
              <Label>Destino</Label>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {d.name}
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
              </p>
              <p className="text-sm text-white/60">{d.region}</p>
            </div>
            <div>
              <Label>Categoría</Label>
              <p className="mt-1 font-semibold">{d.category}</p>
              <p className="text-sm text-white/60">{d.badge}</p>
            </div>
            <div>
              <Label>Experiencia</Label>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 shrink-0 text-white/60" />
                {d.duration}
              </p>
            </div>
            <div>
              <Label>Valoración</Label>
              <p className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={s < d.rating ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-white/25"}
                  />
                ))}
                <span className="ml-1 text-sm font-semibold">{d.rating}.0</span>
              </p>
            </div>
          </motion.div>

          {/* Centro: título + tagline + precio + CTA + puntos */}
          <div className="flex flex-col items-center text-center">
            <motion.h3
              key={`t-${scope}-${i}`}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)] sm:text-6xl"
            >
              {d.name}
            </motion.h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-base">
              {d.tagline}
            </p>

            <div className="mt-8 w-full">
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/95 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.4)] backdrop-blur sm:flex-row sm:justify-between dark:border-white/10 dark:bg-surface/95">
                <div className="text-center sm:text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Desde</p>
                  <p className="text-3xl font-extrabold tabular-nums text-success">
                    {price(d.priceUSD, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Vuelo + experiencia, por persona</p>
                </div>
                <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto">
                  <Link
                    href={`/paquetes/${d.slug}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                  >
                    <Ticket className="h-4 w-4" /> Reservar ahora
                  </Link>
                  <Link
                    href={`/paquetes/${d.slug}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
                  >
                    Más información <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                {list.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setI(idx)}
                    aria-label={`Destino ${idx + 1}`}
                    className={
                      "h-2 rounded-full transition-all duration-300 " +
                      (idx === i ? "w-6 bg-white" : "w-2 bg-white/35 hover:bg-white/55")
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Derecha: detalles del VUELO (sistema para avión) */}
          <motion.div
            key={`r-${scope}-${i}`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden flex-col gap-5 text-white lg:flex"
          >
            <div>
              <Label>Cómo llegar</Label>
              <p className="mt-1 flex items-center gap-2 text-lg font-bold">
                <Plane className="h-4 w-4 shrink-0 text-white/70" /> Vuelo{scope === "national" ? " nacional" : " internacional"}
              </p>
            </div>
            <div className="border-t border-white/12 pt-4">
              <Label>Duración de vuelo</Label>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 shrink-0 text-white/60" /> {flight.time}
              </p>
            </div>
            <div className="border-t border-white/12 pt-4">
              <Label>Aerolínea</Label>
              <p className="mt-1 font-semibold">{flight.airline}</p>
            </div>
            <div className="border-t border-white/12 pt-4">
              <Label>Clase</Label>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Tag className="h-4 w-4 shrink-0 text-white/60" /> Económica
              </p>
            </div>
            <div className="mt-1 grid grid-cols-4 gap-2 border-t border-white/12 pt-4">
              {FLIGHT_AMENITIES.map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                  <a.icon className="h-5 w-5 text-white/80" />
                  <span className="text-[10px] leading-tight text-white/55">{a.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
