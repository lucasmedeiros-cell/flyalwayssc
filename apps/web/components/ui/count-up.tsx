"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";

/**
 * Número que cuenta desde cero hasta `value` cuando entra en viewport.
 * Soporta prefijo/sufijo (p. ej. "+", "%", "k") y decimales.
 * Respeta prefers-reduced-motion (muestra el valor final sin animar).
 */
export function CountUp({
  value,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  separator = ".",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Separador de miles. */
  separator?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);

  const text = useTransform(count, (latest) => {
    const fixed = latest.toFixed(decimals);
    const [int, dec] = fixed.split(".");
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${dec ? `${grouped},${dec}` : grouped}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, value, duration, reduced, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  );
}
