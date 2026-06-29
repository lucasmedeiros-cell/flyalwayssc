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
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

/** Stagger más marcado para grillas grandes (cards, destinos, empresas). */
export const staggerContainerWide: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

/** Item que sube y aparece (fade + slide). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Fade + slide + blur que se disuelve: la entrada "premium" por defecto. */
export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** Aparición con escala suave. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(8px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Entrada lateral (para timelines / elementos alternados). */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Reaparición rápida (para listas que cambian). */
export const fadeInFast: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_SPRING } },
};

/** Viewport estándar pedido: una sola vez, cuando ~20% es visible. */
export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

/** Microinteracción de hover/tap compartida para elementos "vivos". */
export const hoverLift = {
  whileHover: { y: -4, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: SPRING_SOFT,
} as const;

/** Flotación continua y muy sutil (mockups, elementos decorativos). */
export const floatLoop = (distance = 10, duration = 6): Variants => ({
  float: {
    y: [0, -distance, 0],
    transition: { duration, ease: "easeInOut", repeat: Infinity },
  },
});
