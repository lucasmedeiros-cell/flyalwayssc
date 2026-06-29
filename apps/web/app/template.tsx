"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * `template.tsx` se re-monta en cada navegación (a diferencia de layout),
 * por lo que es el lugar ideal para la transición de entrada de cada ruta:
 * fade + leve slide/blur, sin pantallas en blanco ni parpadeos.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
