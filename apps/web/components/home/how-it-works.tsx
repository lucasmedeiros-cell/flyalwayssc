"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckCircle2, Plane, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = {
  n: number;
  title: string;
  body: string;
  illo: React.ReactNode;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

const TRUST = [
  { icon: Zap, label: "Rápido" },
  { icon: ShieldCheck, label: "Seguro" },
  { icon: Sparkles, label: "Sin complicaciones" },
  { icon: CheckCircle2, label: "Fácil" },
];

export function HowItWorks() {
  const reduced = useReducedMotion();

  const STEPS: Step[] = [
    { n: 1, title: "Busca y compara", body: "Elige tu ruta y compara aerolíneas, horarios y precios al instante.", illo: <SearchIllo /> },
    { n: 2, title: "Elige tu vuelo", body: "Filtra por horario, escalas o servicios y selecciona tu asiento ideal.", illo: <CompareIllo /> },
    { n: 3, title: "Reserva y vuela", body: "Paga de forma segura, recibe tu ticket digital y listo para despegar.", illo: <TicketIllo /> },
  ];

  return (
    <AnimatedSection id="como-funciona" className="border-y border-border">
      <SectionHeading
        align="center"
        eyebrow="Sencillo y rápido"
        title="Reservar nunca fue tan fácil"
        subtitle="De la búsqueda al despegue en tres pasos, sin fricción ni sorpresas."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mt-14"
      >
        {/* Conector horizontal (desktop) + avión que recorre la ruta */}
        <div className="pointer-events-none absolute inset-x-[16.5%] top-7 hidden -translate-y-1/2 md:block">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-10 w-full overflow-visible">
            <defs>
              <linearGradient id="hiw-line" x1="0" y1="0" x2="100%" y2="0">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <path
              d="M0 10 C 25 2, 40 2, 50 10 S 75 18, 100 10"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M0 10 C 25 2, 40 2, 50 10 S 75 18, 100 10"
              fill="none"
              stroke="url(#hiw-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reduced ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
            />
          </svg>

          {!reduced && (
            <motion.span
              aria-hidden
              className="absolute top-1/2 z-20 -translate-y-1/2"
              initial={{ left: "1%", opacity: 0 }}
              whileInView={{ left: "99%", opacity: [0, 1, 1, 1, 0], y: [0, -7, 0, 7, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 2.6, ease: "easeInOut", delay: 0.4 }}
            >
              <span className="-ml-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-[var(--shadow-glow)]">
                <Plane className="h-3.5 w-3.5 rotate-45" />
              </span>
            </motion.span>
          )}
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepRow key={step.n} step={step} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </motion.div>

      {/* Marketing: fácil · seguro · rápido */}
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
      >
        {TRUST.map((t) => (
          <li key={t.label} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <t.icon className="h-4 w-4 text-primary" />
            {t.label}
          </li>
        ))}
      </motion.ul>
    </AnimatedSection>
  );
}

function StepRow({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
    >
      {/* Riel: círculo + línea vertical (móvil); en desktop el círculo fluye arriba */}
      <div className="relative flex shrink-0 flex-col items-center md:contents">
        <NumberCircle n={step.n} />
        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-primary/40 to-accent/30 md:hidden" />
        )}
      </div>

      {/* Tarjeta */}
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        transition={SPRING_SOFT}
        className={cn(
          "group relative flex-1 overflow-hidden rounded-3xl border border-border bg-surface/80 p-6 shadow-[var(--shadow-sm)] backdrop-blur-sm",
          "transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-glow)]",
          "md:-mt-7 md:w-full md:pt-12",
        )}
      >
        {/* Glow muy ligero al hover */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex justify-center">{step.illo}</div>
        <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
      </motion.div>
    </motion.div>
  );
}

function NumberCircle({ n }: { n: number }) {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.4, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 320, damping: 20 } },
      }}
      className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-strong font-[family-name:var(--font-display)] text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)] ring-4 ring-surface"
    >
      {n}
    </motion.div>
  );
}

/* ----------------------- Ilustraciones (SVG mínimos) ----------------------- */

function IlloFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-surface-2/50">
      {children}
    </div>
  );
}

/** Paso 1 — mapa + lupa (la lupa gira muy ligeramente). */
function SearchIllo() {
  return (
    <IlloFrame>
      <svg viewBox="0 0 120 80" className="h-16 w-auto" fill="none">
        <rect x="14" y="12" width="92" height="56" rx="8" className="fill-surface" stroke="var(--border)" />
        <path d="M14 30 H106 M14 48 H106 M44 12 V68 M76 12 V68" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="62" cy="40" r="4" className="fill-primary" />
        <motion.g
          initial={{ rotate: 0 }}
          whileInView={{ rotate: [0, -10, 6, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
          style={{ originX: "82px", originY: "52px" }}
        >
          <circle cx="82" cy="52" r="13" className="fill-surface" stroke="var(--primary)" strokeWidth="3" />
          <line x1="92" y1="62" x2="102" y2="72" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </svg>
    </IlloFrame>
  );
}

/** Paso 2 — comparación de vuelos (una opción se selecciona). */
function CompareIllo() {
  return (
    <IlloFrame>
      <svg viewBox="0 0 120 80" className="h-16 w-auto" fill="none">
        {[18, 38, 58].map((y, i) => (
          <g key={y}>
            <rect x="16" y={y} width="88" height="14" rx="7" className="fill-surface" stroke="var(--border)" />
            <rect x="22" y={y + 4} width="34" height="6" rx="3" className="fill-muted-foreground/30" />
            <rect x={70} y={y + 4} width="20" height="6" rx="3" className="fill-muted-foreground/20" />
            {i === 1 && (
              <motion.rect
                x="14"
                y={y - 2}
                width="92"
                height="18"
                rx="9"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.7, ease: "easeInOut" }}
              />
            )}
          </g>
        ))}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 360, damping: 18, delay: 1 }}
          style={{ originX: "100px", originY: "45px" }}
        >
          <circle cx="100" cy="45" r="9" className="fill-primary" />
          <path d="M96 45 l3 3 l5 -6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
      </svg>
    </IlloFrame>
  );
}

/** Paso 3 — boarding pass (aparece con un pequeño bounce). */
function TicketIllo() {
  return (
    <IlloFrame>
      <motion.svg
        viewBox="0 0 120 80"
        className="h-16 w-auto"
        fill="none"
        initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
        whileInView={{ scale: [0.7, 1.06, 1], opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <rect x="14" y="22" width="92" height="36" rx="8" className="fill-surface" stroke="var(--border)" />
        <path d="M80 22 V58" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="80" cy="22" r="3" className="fill-surface-2" stroke="var(--border)" />
        <circle cx="80" cy="58" r="3" className="fill-surface-2" stroke="var(--border)" />
        <rect x="22" y="30" width="30" height="5" rx="2.5" className="fill-muted-foreground/30" />
        <rect x="22" y="42" width="46" height="5" rx="2.5" className="fill-muted-foreground/20" />
        <g className="text-primary">
          <circle cx="93" cy="40" r="11" className="fill-primary/12" />
          <path d="M88 41 l10 -3 l-3 8 l-2 -3 z" className="fill-primary" />
        </g>
      </motion.svg>
    </IlloFrame>
  );
}
