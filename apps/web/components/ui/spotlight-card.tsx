"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, type Variants } from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Tarjeta premium con "spotlight" que sigue al cursor, borde que se ilumina
 * y leve elevación al hover. Pensada para envolver contenido de cards.
 * El efecto de luz se desactiva solo en dispositivos sin puntero fino.
 */
export function SpotlightCard({
  children,
  className,
  variants,
  spotlightColor = "rgba(106, 92, 255, 0.16)",
  lift = true,
  as = "article",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  spotlightColor?: string;
  lift?: boolean;
  as?: "article" | "div";
}) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  const MotionTag = as === "article" ? motion.article : motion.div;

  return (
    <MotionTag
      ref={ref}
      variants={variants}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
      whileHover={lift ? { y: -5 } : undefined}
      transition={SPRING_SOFT}
      className={cn("group/spotlight relative overflow-hidden", className)}
    >
      {/* Capa de luz que sigue al mouse (solo punteros finos). */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 max-[820px]:hidden"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </MotionTag>
  );
}
