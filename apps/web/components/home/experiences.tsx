"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  MapPin,
  Plane,
  ShieldCheck,
  Star,
  Ticket,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { EXPERIENCE_IMAGES, type CuratedImage } from "@/lib/images";
import { SPRING_SOFT, fadeUp, staggerContainerWide } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Meta = { rating?: number; from?: number; free?: boolean; instant?: boolean };

type Experience = {
  title: string;
  blurb: string;
  cta: string;
  href: string;
  image: CuratedImage;
  badge?: { label: string; className: string };
  meta: Meta;
  span: string;
  large?: boolean;
};

const EXPERIENCES: Experience[] = [
  {
    title: "Hoteles",
    blurb: "Más de 300 hoteles seleccionados, con cancelación gratuita.",
    cta: "Ver hoteles",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.hoteles,
    badge: { label: "Más reservado", className: "bg-primary text-primary-foreground" },
    meta: { rating: 4.7, from: 180, free: true },
    span: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    title: "Tours guiados",
    blurb: "Recorridos con guías certificados por todo el país.",
    cta: "Explorar tours",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.tours,
    badge: { label: "Popular", className: "bg-accent text-accent-foreground" },
    meta: { rating: 4.9, from: 220 },
    span: "md:col-span-2",
  },
  {
    title: "Alquiler de autos",
    blurb: "Recoge al llegar y muévete a tu propio ritmo.",
    cta: "Buscar autos",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.autos,
    meta: { from: 90, instant: true },
    span: "",
  },
  {
    title: "Seguro de viaje",
    blurb: "Cobertura médica y de equipaje, viaja tranquilo.",
    cta: "Contratar seguro",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.seguro,
    badge: { label: "Recomendado", className: "bg-success text-white" },
    meta: { from: 35 },
    span: "",
  },
  {
    title: "Actividades",
    blurb: "Entradas a museos y espectáculos, sin filas.",
    cta: "Ver actividades",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.actividades,
    badge: { label: "Nuevo", className: "bg-primary text-primary-foreground" },
    meta: { from: 45, instant: true },
    span: "md:col-span-2",
  },
  {
    title: "Excursiones",
    blurb: "Aventuras de un día a paisajes naturales únicos.",
    cta: "Descubrir excursiones",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.excursiones,
    meta: { rating: 4.8 },
    span: "",
  },
  {
    title: "Restaurantes",
    blurb: "Reserva en la mejor gastronomía boliviana.",
    cta: "Reservar mesa",
    href: "/buscar?mode=air",
    image: EXPERIENCE_IMAGES.restaurantes,
    badge: { label: "Próximamente", className: "bg-warning text-white" },
    meta: {},
    span: "",
  },
];

const JOURNEY = [
  { icon: Plane, label: "Transporte" },
  { icon: BedDouble, label: "Hotel" },
  { icon: Ticket, label: "Actividades" },
  { icon: UtensilsCrossed, label: "Restaurante" },
  { icon: ShieldCheck, label: "Seguro" },
];

const BOB = new Intl.NumberFormat("es-BO");

export function Experiences() {
  return (
    <AnimatedSection id="experiencias">
      <SectionHeading
        align="center"
        eyebrow="Un solo lugar"
        title="Completa tu viaje, de principio a fin"
        subtitle="El vuelo es solo el comienzo. Suma estadía, experiencias y servicios y arma tu itinerario completo sin salir de FlyAlways."
      />

      {/* Bonus: el itinerario del viajero, todo conectado. */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-medium text-muted-foreground">
        {JOURNEY.map((s, i) => (
          <Fragment key={s.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
              <s.icon className="h-3.5 w-3.5 text-primary" />
              {s.label}
            </span>
            {i < JOURNEY.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />}
          </Fragment>
        ))}
      </div>

      {/* Bento: carrusel en móvil, mosaico en desktop. */}
      <motion.div
        variants={staggerContainerWide}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={cn(
          "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:snap-none md:auto-rows-[13rem] md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4 lg:auto-rows-[12rem]",
        )}
      >
        {EXPERIENCES.map((exp) => (
          <ExperienceCard key={exp.title} exp={exp} />
        ))}
      </motion.div>
    </AnimatedSection>
  );
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const { meta } = exp;
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={SPRING_SOFT}
      className={cn(
        "group relative flex h-80 shrink-0 basis-[82%] snap-start flex-col justify-end overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-sm)]",
        "transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]",
        "sm:basis-[58%] md:h-auto md:basis-auto",
        exp.span,
      )}
    >
      <SmartImage
        image={exp.image}
        sizes="(max-width: 768px) 82vw, (max-width: 1024px) 50vw, 33vw"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/30 to-transparent transition-all duration-300 group-hover:from-slate-950/95" />

      {exp.badge && (
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold", exp.badge.className)}>
          {exp.badge.label}
        </span>
      )}

      <div className="relative z-10 p-5">
        <h3
          className={cn(
            "font-[family-name:var(--font-display)] font-bold leading-tight text-white text-on-photo transition-colors duration-200 group-hover:text-[#cfc8ff]",
            exp.large ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {exp.title}
        </h3>
        <p className={cn("mt-1 text-white/80", exp.large ? "max-w-sm text-sm" : "line-clamp-2 text-xs")}>
          {exp.blurb}
        </p>

        {/* Info contextual (sin sobrecargar) */}
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

        {/* CTA contextual: visible en móvil, aparece al hover en desktop. */}
        <Link
          href={exp.href}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-300",
            "md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100",
            "hover:gap-2.5",
          )}
        >
          {exp.cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
