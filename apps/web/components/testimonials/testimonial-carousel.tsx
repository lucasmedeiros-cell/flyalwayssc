"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Plane, Quote } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { VerifiedBadge, type VerifiedKind } from "@/components/ui/verified-badge";
import { CountUp } from "@/components/ui/count-up";
import { SectionHeading } from "@/components/ui/section";
import { SPRING_GENTLE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Testimonial = {
  name: string;
  city: string;
  tripType: string;
  company: string;
  text: string;
  rating: number;
  date: string;
  kind: VerifiedKind;
};

export type CarouselStat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

const AUTO_MS = 6000;
const AVATAR_COLORS = ["#3a23a8", "#e62020", "#1ca71c", "#5a3fd0"];

export function TestimonialCarousel({
  items,
  eyebrow,
  title,
  subtitle,
  stats,
}: {
  items: Testimonial[];
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  stats?: CarouselStat[];
}) {
  const count = items.length;
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const go = useCallback(
    (target: number, direction: number) => setState([(target + count) % count, direction]),
    [count],
  );

  // Autoplay cada 6 s; en pausa (hover/focus) o reduced-motion no avanza.
  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const t = setInterval(() => setState(([i]) => [(i + 1) % count, 1]), AUTO_MS);
    return () => clearInterval(t);
  }, [reduced, paused, count]);

  const active = items[index];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 44 : -44, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -44 : 44, scale: 0.97 }),
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
      {/* Lado izquierdo: encabezado · estadísticas · navegación */}
      <div>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {stats && stats.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix ?? ""}
                    className="font-[family-name:var(--font-display)] text-3xl font-bold text-gradient sm:text-4xl"
                  />
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.label}</p>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Controles del carrusel */}
        <div className="mt-9 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CarouselButton label="Anterior" onClick={() => go(index - 1, -1)}>
              <ChevronLeft className="h-5 w-5" />
            </CarouselButton>
            <CarouselButton label="Siguiente" onClick={() => go(index + 1, 1)}>
              <ChevronRight className="h-5 w-5" />
            </CarouselButton>
          </div>

          {/* Indicadores */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonios">
            {items.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Ver testimonio de ${t.name}`}
                onClick={() => go(i, i > index ? 1 : -1)}
                className="group/dot py-2"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "w-7 bg-primary"
                      : "w-1.5 bg-border group-hover/dot:bg-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>

          <span className="ml-auto text-sm font-medium tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
            <span className="text-border"> / {String(count).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      {/* Lado derecho: tarjeta protagonista animada */}
      <div
        className="relative min-h-[340px] sm:min-h-[300px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <AnimatePresence initial={false} mode="wait" custom={dir}>
          <motion.article
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduced ? { duration: 0 } : SPRING_GENTLE}
            className="glass relative overflow-hidden rounded-[1.75rem] border border-border p-7 shadow-[var(--shadow-lg)] sm:p-9"
          >
            {/* Comillas decorativas */}
            <Quote
              className="absolute -right-3 -top-3 h-24 w-24 rotate-180 text-primary/10"
              aria-hidden
            />
            {/* Glow de marca en la esquina */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
            />

            <div className="relative flex items-center gap-4">
              <Avatar name={active.name} index={index} />
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg font-bold leading-tight">
                  {active.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {active.city}
                </p>
              </div>
              <div className="ml-auto hidden sm:block">
                <VerifiedBadge kind={active.kind} />
              </div>
            </div>

            {/* Viaje + empresa */}
            <div className="relative mt-5 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
                <Plane className="h-3.5 w-3.5" />
                {active.tripType}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-muted-foreground">
                con {active.company}
              </span>
            </div>

            {/* Separador elegante */}
            <div className="relative my-5 h-px bg-gradient-to-r from-border via-border to-transparent" />

            {/* Comentario */}
            <blockquote className="relative text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
              “{active.text}”
            </blockquote>

            {/* Pie: rating + fecha + badge móvil */}
            <div className="relative mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <RatingStars rating={active.rating} size={18} showValue />
              <span className="text-sm text-muted-foreground">· {active.date}</span>
              <div className="sm:hidden">
                <VerifiedBadge kind={active.kind} />
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Avatar({ name, index }: { name: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();
  const size = 72;
  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] font-bold text-white ring-4 ring-surface"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, #000))`,
        boxShadow: `0 10px 28px -8px ${color}aa`,
      }}
    >
      {initials}
    </span>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-[var(--shadow-sm)] transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </motion.button>
  );
}
