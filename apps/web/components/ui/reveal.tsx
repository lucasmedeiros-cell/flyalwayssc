"use client";

import { motion } from "framer-motion";
import {
  fadeUp,
  fadeUpBlur,
  scaleIn,
  slideInLeft,
  staggerContainer,
  staggerContainerWide,
} from "@/lib/motion";

type RevealVariant = "fade" | "blur" | "scale" | "left";

const VARIANTS = {
  fade: fadeUp,
  blur: fadeUpBlur,
  scale: scaleIn,
  left: slideInLeft,
} as const;

/** Contenedor que revela a sus hijos al entrar en viewport (escalonado). */
export function Reveal({
  children,
  className,
  amount = 0.2,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  /** Stagger más amplio para grillas grandes. */
  wide?: boolean;
}) {
  return (
    <motion.div
      variants={wide ? staggerContainerWide : staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Hijo individual de <Reveal> (fade + slide up, o variante elegida). */
export function RevealItem({
  children,
  className,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  return (
    <motion.div variants={VARIANTS[variant]} className={className}>
      {children}
    </motion.div>
  );
}
