"use client";

import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { DynamicLogo } from "@/components/ui/dynamic-logo";

export type OperatorBrand = {
  name: string;
  /** Slug para cargar el logo oficial desde /public/logos/... */
  slug: string;
  icon: LucideIcon;
  category: string;
  country: string;
  routes: number;
  rating: number;
  years: number;
  coverage: string;
  color: string;
};

export function OperatorCarousel({
  items,
  /** Duración de una vuelta completa (mayor = más lento). */
  duration = 42,
}: {
  items: OperatorBrand[];
  duration?: number;
}) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const loop = [...items, ...items];

  // Carrusel puramente informativo: gira en loop continuo, sin pausa al hover.
  useEffect(() => {
    if (reduced) return;
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration, ease: "linear", repeat: Infinity },
    });
  }, [controls, reduced, duration]);

  // Accesibilidad: con reduced-motion no hay marquee — grilla envolvente estática.
  if (reduced) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {items.map((op) => (
          <OperatorCard key={op.name} op={op} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <motion.div className="flex w-max items-center gap-12 py-4" animate={controls}>
        {loop.map((op, i) => (
          <OperatorCard key={`${op.name}-${i}`} op={op} />
        ))}
      </motion.div>
    </div>
  );
}

/** Tarjeta-logo: solo el logotipo, grande y centrado, sobre placa blanca. Sin acción. */
function OperatorCard({ op }: { op: OperatorBrand }) {
  const initials = op.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-24 shrink-0 select-none items-center justify-center rounded-2xl px-8">
      <DynamicLogo
        kind={op.category === "Aéreo" ? "airlines" : "operators"}
        slug={op.slug}
        name={op.name}
        mark={initials}
        color={op.color}
        icon={op.icon}
        bare
        className="max-h-16"
      />
    </div>
  );
}
