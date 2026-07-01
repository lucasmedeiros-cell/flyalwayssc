"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { DESTINATION_IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

type Tag = "Tendencia" | "🔥 Popular" | null;

type Destination = {
  name: string;
  country: string;
  from: number;
  mode: "air" | "bus" | "train" | "private";
  tag: Tag;
};

const NACIONALES: Destination[] = [
  { name: "Uyuni", country: "Potosí, Bolivia", from: 690, mode: "air", tag: "🔥 Popular" },
  { name: "La Paz", country: "Bolivia", from: 420, mode: "air", tag: "Tendencia" },
  { name: "Santa Cruz", country: "Bolivia", from: 480, mode: "air", tag: null },
  { name: "Copacabana", country: "Lago Titicaca", from: 45, mode: "air", tag: "Tendencia" },
  { name: "Sucre", country: "Bolivia", from: 460, mode: "air", tag: null },
  { name: "Rurrenabaque", country: "Madidi, Bolivia", from: 690, mode: "air", tag: "🔥 Popular" },
  { name: "Cochabamba", country: "Bolivia", from: 90, mode: "air", tag: null },
  { name: "Tarija", country: "Bolivia", from: 620, mode: "air", tag: "Tendencia" },
];

const INTERNACIONALES: Destination[] = [
  { name: "Buenos Aires", country: "Argentina", from: 1890, mode: "air", tag: "🔥 Popular" },
  { name: "São Paulo", country: "Brasil", from: 2150, mode: "air", tag: "Tendencia" },
  { name: "Lima", country: "Perú", from: 1290, mode: "air", tag: null },
  { name: "Santiago", country: "Chile", from: 1680, mode: "air", tag: "Tendencia" },
  { name: "Río de Janeiro", country: "Brasil", from: 2490, mode: "air", tag: "🔥 Popular" },
  { name: "Bogotá", country: "Colombia", from: 2090, mode: "air", tag: null },
  { name: "Miami", country: "Estados Unidos", from: 3490, mode: "air", tag: "Tendencia" },
  { name: "Madrid", country: "España", from: 5290, mode: "air", tag: null },
  { name: "Cancún", country: "México", from: 3890, mode: "air", tag: "🔥 Popular" },
  { name: "Punta Cana", country: "Rep. Dominicana", from: 4290, mode: "air", tag: "Tendencia" },
];

const BOB = new Intl.NumberFormat("es-BO");

type Scope = "nacional" | "internacional";

export function PopularDestinations() {
  const [scope, setScope] = useState<Scope>("nacional");
  const [active, setActive] = useState(0);

  const items = scope === "nacional" ? NACIONALES : INTERNACIONALES;
  const current = items[active];

  const switchScope = (next: Scope) => {
    setScope(next);
    setActive(0);
  };

  const go = (i: number) => setActive(Math.max(0, Math.min(items.length - 1, i)));

  // Navegación por teclado (flechas) cuando el showcase tiene foco.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
  };

  return (
    <Section id="destinos">
      <SectionHeading
        eyebrow="Inspiración"
        title={
          <>
            Destinos que <span className="text-gradient">enamoran</span>
          </>
        }
        subtitle="Elige el alcance, desliza y descubre tu próximo viaje."
      />

      {/* Toggle Nacional / Internacional (estilo segmentado) */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full bg-surface-2 p-1.5 shadow-[var(--shadow-sm)]">
          {(
            [
              { id: "nacional" as const, label: "Nacionales", emoji: "🇧🇴" },
              { id: "internacional" as const, label: "Internacionales", emoji: "🌎" },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => switchScope(opt.id)}
              className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:px-7"
            >
              {scope === opt.id && (
                <motion.span
                  layoutId="dest-scope-pill"
                  className="absolute inset-0 rounded-full bg-foreground shadow-[var(--shadow-sm)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 inline-flex items-center gap-1.5 transition-colors",
                  scope === opt.id ? "text-background" : "text-muted-foreground",
                )}
              >
                <span aria-hidden>{opt.emoji}</span>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Showcase: destino central grande + vecinos asomando a los costados */}
      <div
        className="relative mt-10 h-72 select-none outline-none sm:h-80"
        role="group"
        aria-roledescription="carrusel"
        aria-label="Destinos populares"
        tabIndex={0}
        onKeyDown={onKey}
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            // Swipe con momentum: la distancia + la velocidad deciden cuántos
            // destinos avanzar, para un gesto natural y fluido.
            const power = info.offset.x + info.velocity.x * 0.18;
            const steps = Math.round(power / -150);
            if (steps !== 0) go(active + steps);
            else if (info.offset.x < -55) go(active + 1);
            else if (info.offset.x > 55) go(active - 1);
          }}
        >
          {items.map((dest, i) => {
            const pos = i - active;
            if (Math.abs(pos) > 2) return null;
            return <ShowcaseCircle key={dest.name} dest={dest} pos={pos} onClick={() => go(i)} />;
          })}
        </motion.div>
      </div>

      {/* Hint de deslizamiento */}
      <p className="mt-2 text-center text-sm text-muted-foreground">Desliza para ver más destinos</p>

      {/* Título + país + precio del destino activo */}
      <motion.div
        key={`${scope}-${active}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-center"
      >
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {current.country}
        </div>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          {current.name}
        </h3>
        <p className="mt-1.5 text-lg font-semibold text-primary">
          desde Bs {BOB.format(current.from)}
        </p>
      </motion.div>

      {/* Puntos de navegación */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((dest, i) => (
          <button
            key={dest.name}
            type="button"
            aria-label={`Ver ${dest.name}`}
            aria-current={active === i}
            onClick={() => go(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              active === i ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>

      {/* CTA al buscador del destino activo */}
      <div className="mt-7 flex justify-center">
        <Link
          href={`/buscar?mode=${current.mode}`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:gap-3 hover:brightness-110"
        >
          Buscar vuelos a {current.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

/** Recuadro circular posicionado según su distancia (pos) al destino activo. */
function ShowcaseCircle({
  dest,
  pos,
  onClick,
}: {
  dest: Destination;
  pos: number;
  onClick: () => void;
}) {
  const abs = Math.abs(pos);
  const isCenter = pos === 0;
  const scale = isCenter ? 1 : abs === 1 ? 0.66 : 0.5;
  const opacity = isCenter ? 1 : abs === 1 ? 0.62 : 0.32;
  // Profundidad cinematográfica: los vecinos se difuminan y oscurecen suavemente.
  const blur = isCenter ? 0 : abs === 1 ? 1.4 : 3;
  const brightness = isCenter ? 1 : abs === 1 ? 0.82 : 0.66;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={dest.name}
      tabIndex={isCenter ? 0 : -1}
      className={cn(
        "absolute left-1/2 top-1/2 aspect-square w-56 overflow-hidden rounded-full border border-border shadow-[var(--shadow-lg)] sm:w-64",
        isCenter ? "ring-4 ring-primary/30" : "cursor-pointer",
      )}
      style={{ zIndex: 30 - abs, willChange: "transform, opacity, filter" }}
      animate={{
        x: `calc(-50% + ${pos * 64}%)`,
        y: "-50%",
        scale,
        opacity,
        filter: `blur(${blur}px) brightness(${brightness})`,
      }}
      transition={{
        // Posición con un spring suave (glide fluido, leve overshoot);
        // opacidad/escala/blur con tween para una transición limpia y pareja.
        default: { type: "spring", stiffness: 210, damping: 26, mass: 0.9 },
        opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        scale: { type: "spring", stiffness: 240, damping: 28 },
      }}
      whileHover={isCenter ? undefined : { scale: scale * 1.05, opacity: Math.min(1, opacity + 0.2) }}
      whileTap={isCenter ? { scale: 0.985 } : { scale: scale * 1.03 }}
    >
      <SmartImage
        image={DESTINATION_IMAGES[dest.name]}
        sizes="(max-width: 640px) 14rem, 16rem"
        imgClassName={cn("transition-transform duration-700", isCenter && "scale-105")}
        priority={isCenter}
      />
      {/* Scrim para legibilidad del badge */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

      {isCenter && dest.tag && (
        <Badge
          tone={dest.tag === "Tendencia" ? "accent" : "warning"}
          className="absolute left-1/2 top-4 -translate-x-1/2 backdrop-blur-sm"
        >
          {dest.tag}
        </Badge>
      )}
    </motion.button>
  );
}
