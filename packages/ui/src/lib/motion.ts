import type { Variants, Transition } from "framer-motion";

/** Curva "spring suave" — entrada elegante con leve overshoot controlado. */
export const EASE_SPRING = [0.22, 1, 0.36, 1] as const;
/** Curva easeOut amplia para movimientos largos y lujosos. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Spring reutilizable para layout / pills / elementos que se reacomodan. */
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 380, damping: 32 };
export const SPRING_GENTLE: Transition = { type: "spring", stiffness: 220, damping: 26 };

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/** Item que sube y aparece (fade + slide). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Fade + slide + blur que se disuelve: la entrada "premium" por defecto. */
export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Reaparición rápida (para listas que cambian). */
export const fadeInFast: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_SPRING } },
};

/** Viewport estándar: una sola vez, cuando ~15% es visible. */
export const VIEWPORT_ONCE = { once: true, amount: 0.15 } as const;
