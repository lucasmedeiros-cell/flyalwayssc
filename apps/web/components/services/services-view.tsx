"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Star,
  MapPin,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Headset,
  Wallet,
  Layers,
  Mail,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_IMAGES, type CuratedImage } from "@/lib/images";
import { fadeUp, staggerContainerWide } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ServiceCategory = "alojamiento" | "actividades" | "transporte" | "seguros" | "gastronomia";

type Service = {
  title: string;
  blurb: string;
  image: CuratedImage;
  category: ServiceCategory;
  badge?: { label: string; className: string };
  meta: { rating?: number; from?: number; free?: boolean; instant?: boolean };
  available: boolean;
};

const CONTACT = "reservas@flyalways.bo";

const SERVICES: Service[] = [
  {
    title: "Hoteles",
    blurb: "Más de 300 hoteles seleccionados, con cancelación gratuita.",
    image: EXPERIENCE_IMAGES.hoteles,
    category: "alojamiento",
    badge: { label: "Más reservado", className: "bg-primary text-primary-foreground" },
    meta: { rating: 4.7, from: 180, free: true },
    available: true,
  },
  {
    title: "Tours guiados",
    blurb: "Recorridos con guías certificados por todo el país.",
    image: EXPERIENCE_IMAGES.tours,
    category: "actividades",
    badge: { label: "Popular", className: "bg-accent text-accent-foreground" },
    meta: { rating: 4.9, from: 220 },
    available: true,
  },
  {
    title: "Alquiler de autos",
    blurb: "Recoge al llegar y muévete a tu propio ritmo.",
    image: EXPERIENCE_IMAGES.autos,
    category: "transporte",
    meta: { from: 90, instant: true },
    available: true,
  },
  {
    title: "Seguro de viaje",
    blurb: "Cobertura médica y de equipaje, viaja tranquilo.",
    image: EXPERIENCE_IMAGES.seguro,
    category: "seguros",
    badge: { label: "Recomendado", className: "bg-success text-white" },
    meta: { from: 35 },
    available: true,
  },
  {
    title: "Actividades",
    blurb: "Entradas a museos y espectáculos, sin filas.",
    image: EXPERIENCE_IMAGES.actividades,
    category: "actividades",
    badge: { label: "Nuevo", className: "bg-primary text-primary-foreground" },
    meta: { from: 45, instant: true },
    available: true,
  },
  {
    title: "Excursiones",
    blurb: "Aventuras de un día a paisajes naturales únicos.",
    image: EXPERIENCE_IMAGES.excursiones,
    category: "actividades",
    meta: { rating: 4.8 },
    available: true,
  },
  {
    title: "Restaurantes",
    blurb: "Reserva en la mejor gastronomía boliviana.",
    image: EXPERIENCE_IMAGES.restaurantes,
    category: "gastronomia",
    badge: { label: "Próximamente", className: "bg-warning text-white" },
    meta: {},
    available: false,
  },
];

const FILTERS: { key: ServiceCategory | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "alojamiento", label: "Alojamiento" },
  { key: "actividades", label: "Actividades" },
  { key: "transporte", label: "Transporte" },
  { key: "seguros", label: "Seguros" },
  { key: "gastronomia", label: "Gastronomía" },
];

const BENEFITS = [
  { icon: Layers, title: "Todo en un solo lugar", text: "Vuelo, estadía y experiencias en un mismo itinerario." },
  { icon: ShieldCheck, title: "Pago 100% protegido", text: "Conexión cifrada y proveedores verificados." },
  { icon: Headset, title: "Asesoría 24/7", text: "Un equipo real te acompaña antes, durante y después." },
  { icon: Wallet, title: "Precio transparente", text: "Sin cargos ocultos: lo que ves es lo que pagas." },
];

const BOB = new Intl.NumberFormat("es-BO");

export function ServicesView() {
  const [filter, setFilter] = useState<ServiceCategory | "all">("all");

  const services = useMemo(
    () => (filter === "all" ? SERVICES : SERVICES.filter((s) => s.category === filter)),
    [filter],
  );

  return (
    <>
      {/* Hero */}
      <AnimatedSection id="servicios" decorated>
        <SectionHeading
          align="center"
          eyebrow="Servicios para tu viaje"
          title="Completa tu viaje, de principio a fin"
          subtitle="El vuelo es solo el comienzo. Suma estadía, experiencias, traslados y seguros y arma tu itinerario completo sin salir de FlyAlways."
        />
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/buscar?mode=air">
            <Button size="lg">
              <Plane className="h-4 w-4" /> Buscar vuelos
            </Button>
          </Link>
          <a href={`mailto:${CONTACT}?subject=${encodeURIComponent("Consulta de servicios — FlyAlways")}`}>
            <Button size="lg" variant="outline">
              <Headset className="h-4 w-4" /> Hablar con un asesor
            </Button>
          </a>
        </div>

        {/* Filtros por categoría */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grid de servicios */}
        <motion.div
          key={filter}
          variants={staggerContainerWide}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Beneficios */}
      <AnimatedSection decorated={false}>
        <SectionHeading
          align="center"
          eyebrow="Por qué FlyAlways"
          title="Reserva tus servicios con confianza"
          subtitle="La misma experiencia cuidada de tus vuelos, ahora para todo tu viaje."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}

function ServiceCard({ service: s }: { service: Service }) {
  const { meta } = s;
  const mailto = `mailto:${CONTACT}?subject=${encodeURIComponent(`Consulta: ${s.title} — FlyAlways`)}`;

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-sm)]",
        "transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]",
      )}
    >
      <SmartImage
        image={s.image}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/30 to-transparent transition-all duration-300 group-hover:from-slate-950/95" />

      {s.badge && (
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold", s.badge.className)}>
          {s.badge.label}
        </span>
      )}

      <div className="relative z-10 p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-white text-on-photo">
          {s.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/80">{s.blurb}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-white/85">
          {meta.rating != null && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {meta.rating}
            </span>
          )}
          {meta.from != null && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              desde Bs {BOB.format(meta.from)}
            </span>
          )}
          {meta.free && (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Cancelación gratis
            </span>
          )}
          {meta.instant && (
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3 text-accent" />
              Reserva inmediata
            </span>
          )}
        </div>

        {s.available ? (
          <a
            href={mailto}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:gap-2.5"
          >
            <Mail className="h-3.5 w-3.5" />
            Solicitar
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
            Próximamente
          </span>
        )}
      </div>
    </motion.article>
  );
}
