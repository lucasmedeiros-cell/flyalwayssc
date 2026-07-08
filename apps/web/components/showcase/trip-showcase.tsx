"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dancing_Script } from "next/font/google";
import {
  MapPin,
  Navigation,
  CalendarDays,
  ArrowLeftRight,
  Search,
  Plane,
  Wallet,
  ShieldCheck,
  Headphones,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Place, PassengerCount, TripKind } from "@vialta/types";
import { CLASSES_BY_MODE, TRAVEL_CLASS_LABEL, emptyPassengers } from "@vialta/types";
import { getDataSource } from "@/lib/services";
import { SmartImage } from "@/components/ui/smart-image";
import { BrandLogo } from "@/components/ui/brand-logo";
import { unsplash, type CuratedImage } from "@/lib/images";
import { cn } from "@/lib/utils";

// Fuente script para el titular (adaptación del lettering manuscrito del diseño).
const script = Dancing_Script({ subsets: ["latin"], weight: ["600", "700"] });

// Foto principal: avión volando (en aproximación, de frente).
const AIRPLANE: CuratedImage = {
  src: unsplash("1569629743817-70d8db6c323b", 1920),
  alt: "Avión volando de frente en el cielo",
  gradient: "from-sky-500/40 via-primary/20 to-slate-900/55",
};

interface Benefit {
  icon: LucideIcon;
  title: string;
  desc: string;
}
const BENEFITS: Benefit[] = [
  { icon: Wallet, title: "Mejores tarifas", desc: "Precios en bolivianos, sin cargos ocultos." },
  { icon: Plane, title: "Aerolíneas líderes", desc: "BoA, LATAM, Avianca, Copa y más." },
  { icon: ShieldCheck, title: "Cancelación flexible", desc: "Cambios y reembolsos sin complicaciones." },
  { icon: Headphones, title: "Soporte 24/7", desc: "Atención nacional cuando lo necesites." },
];

/** Etiqueta pequeña en mayúsculas de los paneles. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{children}</p>
  );
}

/** Campo del buscador del hero: caja TRANSPARENTE, etiqueta/íconos/texto en
 *  blanco, sin depender del tema (claro/oscuro). */
function GlassField({
  label,
  icon,
  className,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/60">{label}</span>
      <span className="flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-white/25 bg-transparent px-4 py-3 text-white transition-colors focus-within:border-white/60 focus-within:bg-white/5">
        {icon && <span className="shrink-0 text-white/80">{icon}</span>}
        {children}
      </span>
    </label>
  );
}

/** Select nativo con texto blanco; opciones legibles (fondo oscuro). */
function ShowcaseSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-white outline-none"
    >
      {placeholder && (
        <option value="" disabled className="bg-slate-900 text-white">
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}

export function TripShowcase() {
  const router = useRouter();
  const mode = "air" as const;

  const [places, setPlaces] = useState<Place[]>([]);
  const [originId, setOriginId] = useState<string>();
  const [destinationId, setDestinationId] = useState<string>();
  const [tripKind, setTripKind] = useState<TripKind>("round_trip");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCount>(emptyPassengers());
  const [travelClass, setTravelClass] = useState("");

  const classes = useMemo(() => CLASSES_BY_MODE[mode], [mode]);

  useEffect(() => {
    let active = true;
    getDataSource()
      .listPlaces(mode)
      .then((list) => {
        if (!active) return;
        setPlaces(list);
        setOriginId((prev) => (list.some((p) => p.id === prev) ? prev : list[0]?.id));
        setDestinationId((prev) =>
          list.some((p) => p.id === prev) ? prev : list[list.length - 1]?.id,
        );
        setTravelClass((prev) => (classes.includes(prev as never) ? prev : classes[0]));
      });
    return () => {
      active = false;
    };
  }, [classes]);

  const swap = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (originId) params.set("origin", originId);
    if (destinationId) params.set("destination", destinationId);
    params.set("trip", tripKind);
    if (departDate) params.set("depart", departDate);
    if (tripKind === "round_trip" && returnDate) params.set("return", returnDate);
    params.set("adults", String(passengers.adults));
    params.set("children", String(passengers.children));
    params.set("infants", String(passengers.infants));
    if (travelClass) params.set("class", travelClass);
    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden bg-slate-950">
      {/* Imagen continua a todo lo ancho (degrada al gradiente de marca si falla). */}
      <div className="absolute inset-0 -z-10">
        <SmartImage image={AIRPLANE} priority sizes="100vw" imgClassName="scale-105" />
        <div className="absolute inset-y-0 left-0 hidden w-[40%] bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent lg:block" />
        {/* Velo superior para que el titular blanco sea legible sobre el avión. */}
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-slate-950/45 lg:hidden" />
      </div>

      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-12">
        {/* ── Titular (arriba, centrado, sobre el avión) ── */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)] sm:text-6xl"
          >
            Tu próximo destino
            <span className={`mt-1 block text-[#5b9dff] ${script.className} text-5xl sm:text-7xl`}>
              te está esperando
            </span>
          </motion.h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-base">
            Compara y reserva vuelos por toda Bolivia y al mundo, al mejor precio.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </span>
            <span className="font-semibold">4.9/5</span>
            <span className="opacity-80">· +500.000 viajeros en Bolivia</span>
          </div>
        </div>

        {/* ── Columnas: buscador · (avión al centro) · beneficios ── */}
        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)_minmax(0,280px)] lg:gap-8">
          {/* Panel izquierdo: BUSCADOR de vuelos (funcional) */}
          <motion.aside
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            <form onSubmit={submit} className="flex flex-col gap-3.5">
            {/* Ida y vuelta / Solo ida */}
            <div className="inline-flex self-start rounded-2xl bg-white/10 p-1 text-sm text-white">
              {(
                [
                  { k: "round_trip", label: "Ida y vuelta" },
                  { k: "one_way", label: "Solo ida" },
                ] as { k: TripKind; label: string }[]
              ).map((o) => (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => setTripKind(o.k)}
                  className={
                    "rounded-xl px-3.5 py-1.5 font-medium transition-colors " +
                    (tripKind === o.k ? "bg-white text-slate-900" : "text-white/70 hover:text-white")
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>

            <GlassField label="Origen" icon={<MapPin className="h-4 w-4" />}>
              <ShowcaseSelect value={originId ?? ""} onChange={setOriginId} placeholder="Selecciona">
                {places
                  .filter((p) => p.id !== destinationId)
                  .map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.city} ({p.code}) · {p.country}
                    </option>
                  ))}
              </ShowcaseSelect>
            </GlassField>

            <div className="relative">
              <GlassField label="Destino" icon={<Navigation className="h-4 w-4" />}>
                <ShowcaseSelect value={destinationId ?? ""} onChange={setDestinationId} placeholder="Selecciona">
                  {places
                    .filter((p) => p.id !== originId)
                    .map((p) => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.city} ({p.code}) · {p.country}
                      </option>
                    ))}
                </ShowcaseSelect>
              </GlassField>
              <button
                type="button"
                onClick={swap}
                aria-label="Intercambiar origen y destino"
                className="absolute -top-7 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassField label="Salida" icon={<CalendarDays className="h-4 w-4" />}>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                />
              </GlassField>
              <GlassField
                label="Regreso"
                icon={<CalendarDays className="h-4 w-4" />}
                className={tripKind === "one_way" ? "opacity-40" : undefined}
              >
                <input
                  type="date"
                  value={returnDate}
                  disabled={tripKind === "one_way"}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none disabled:cursor-not-allowed [color-scheme:dark]"
                />
              </GlassField>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <GlassField label="Pasajeros" icon={<Users className="h-4 w-4" />}>
                <ShowcaseSelect
                  value={String(passengers.adults)}
                  onChange={(v) => setPassengers({ adults: Number(v), children: 0, infants: 0 })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n} className="bg-slate-900 text-white">
                      {n} {n === 1 ? "pasajero" : "pasajeros"}
                    </option>
                  ))}
                </ShowcaseSelect>
              </GlassField>
              <GlassField label="Clase">
                <ShowcaseSelect value={travelClass} onChange={setTravelClass}>
                  {classes.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {TRAVEL_CLASS_LABEL[c]}
                    </option>
                  ))}
                </ShowcaseSelect>
              </GlassField>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
            >
              <Search className="h-5 w-5" /> Buscar vuelo
            </motion.button>
          </form>
        </motion.aside>

        {/* Centro: espacio abierto donde se luce el avión. */}
        <div className="hidden lg:block" aria-hidden />

        {/* ── Panel derecho: por qué FlyAlways ── */}
        <motion.aside
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden flex-col gap-5 text-white lg:flex"
        >
          <Label>¿Por qué FlyAlways?</Label>
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3 border-t border-white/12 pt-4 first:border-t-0 first:pt-0">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold leading-tight">{b.title}</p>
                <p className="mt-0.5 text-sm text-white/60">{b.desc}</p>
              </div>
            </div>
          ))}
        </motion.aside>
        </div>
      </div>
    </section>
  );
}
