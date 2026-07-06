"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "../lib/cn";

export interface FlyingPlaneProps {
  /** Clases para el contenedor overlay (posicionamiento, capa, etc.). */
  className?: string;
  /** Duración de un cruce completo, en segundos. */
  duration?: number;
  /** Pausa entre cruces, en segundos. */
  repeatDelay?: number;
  /** Retraso inicial antes del primer cruce, en segundos. */
  delay?: number;
  /** Tamaño del ícono del avión, en px. */
  size?: number;
}

/**
 * Avioncito decorativo que cruza el contenedor con una estela, en bucle suave.
 * Pensado para captar la atención al ingresar. Respeta `prefers-reduced-motion`.
 * El contenedor padre debe ser `relative` (o usar `className` para posicionar).
 */
export function FlyingPlane({
  className,
  duration = 7,
  repeatDelay = 6,
  delay = 0.6,
  size = 30,
}: FlyingPlaneProps) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <motion.div
        className="absolute top-[28%] left-0 flex items-center"
        initial={{ x: "-18vw", y: 0 }}
        animate={{ x: "120vw", y: [0, -34, 8, -22, 0] }}
        transition={{
          x: { duration, ease: "linear", repeat: Infinity, repeatDelay, delay },
          y: { duration, ease: "easeInOut", repeat: Infinity, repeatDelay, delay },
        }}
      >
        {/* Estela / contrail que se desvanece detrás del avión. */}
        <span className="mr-1 h-[2px] w-24 rounded-full bg-gradient-to-l from-primary/70 to-transparent sm:w-44" />
        <Plane
          className="rotate-45 text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
          style={{ width: size, height: size }}
        />
      </motion.div>
    </div>
  );
}
