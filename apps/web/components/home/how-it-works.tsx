"use client";

import { useCallback, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
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

const STEPS: Step[] = [
  { n: 1, title: "Busca y compara", body: "Elige tu ruta y compara aerolíneas, horarios y precios al instante.", illo: <SearchIllo /> },
  { n: 2, title: "Elige tu vuelo", body: "Filtra por horario, escalas o servicios y selecciona tu asiento ideal.", illo: <CompareIllo /> },
  { n: 3, title: "Reserva y vuela", body: "Paga de forma segura, recibe tu ticket digital y listo para despegar.", illo: <TicketIllo /> },
];

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(STEPS.length - 1, i));
    const card = track.children[clamped] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let idx = 0;
    let best = Infinity;
    Array.from(track.children).forEach((node, i) => {
      const el = node as HTMLElement;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < best) {
        best = dist;
        idx = i;
      }
    });
    setActive(idx);
  }, []);

  return (
    <AnimatedSection id="como-funciona" className="border-y border-border">
      <SectionHeading
        align="center"
        eyebrow="Sencillo y rápido"
        title="Reservar nunca fue tan fácil"
        subtitle="De la búsqueda al despegue en tres pasos, sin fricción ni sorpresas. Desliza para ver cada paso."
      />

      {/* Carrusel: una tarjeta por vista; al deslizar aparece la siguiente */}
      <div className="relative mt-12">
        <motion.div
          ref={trackRef}
          onScroll={handleScroll}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className={cn(
            "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {STEPS.map((step) => (
            <StepCard key={step.n} step={step} />
          ))}
        </motion.div>

        {/* Flechas (desktop) */}
        <button
          type="button"
          aria-label="Paso anterior"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="absolute left-2 top-[42%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-0 md:inline-flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Paso siguiente"
          onClick={() => goTo(active + 1)}
          disabled={active === STEPS.length - 1}
          className="absolute right-2 top-[42%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-0 md:inline-flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Puntos de navegación */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <button
            key={step.n}
            type="button"
            aria-label={`Ir al paso ${step.n}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              active === i ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>

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

function StepCard({ step }: { step: Step }) {
  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group relative flex w-full shrink-0 basis-full snap-center overflow-hidden rounded-3xl border border-border bg-surface/80 p-6 shadow-[var(--shadow-sm)] backdrop-blur-sm sm:p-8",
      )}
    >
      {/* Glow muy ligero */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
        {/* Ilustración */}
        <div className="w-full sm:w-2/5">{step.illo}</div>

        {/* Contenido */}
        <div className="flex-1">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <NumberCircle n={step.n} />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Paso {step.n}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold sm:text-2xl">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{step.body}</p>
        </div>
      </div>
    </motion.article>
  );
}

function NumberCircle({ n }: { n: number }) {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.4, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 320, damping: 20 } },
      }}
      className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-strong font-[family-name:var(--font-display)] text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)] ring-4 ring-surface"
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
