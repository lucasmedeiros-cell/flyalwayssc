"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  wrap,
  type PanInfo,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { DESTINATION_IMAGES } from "@/lib/images";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Hero Carousel de Destinos — experiencia inmersiva a pantalla casi completa.
 *
 * La fotografía es la protagonista: nítida en el centro y difuminada hacia los
 * bordes (backdrop-blur + mask horizontal) para dar profundidad cinematográfica,
 * con un scrim oscuro solo donde vive el texto. Autoplay con barra de progreso
 * (pausa en hover/foco), swipe/drag, teclado e infinito. Respeta
 * `prefers-reduced-motion`. La imagen degrada al gradiente de marca vía SmartImage.
 */

type Destination = {
  /** Clave del catálogo DESTINATION_IMAGES (garantiza foto real existente). */
  imageKey: keyof typeof DESTINATION_IMAGES | string;
  name: string;
  region: string;
  category: string;
  badge: string;
  rating: number;
  duration: string;
  priceUSD: number;
  /** Frase emocional, máximo 2 líneas. */
  tagline: string;
  mode: "air" | "bus" | "train" | "private";
};

/** Destinos curados de Bolivia — aventura, naturaleza, cultura y patrimonio. */
const NATIONAL: Destination[] = [
  {
    imageKey: "Uyuni",
    name: "Salar de Uyuni",
    region: "Potosí, Bolivia",
    category: "Naturaleza",
    badge: "Maravilla Natural",
    rating: 5,
    duration: "3 días • Todo incluido",
    priceUSD: 799,
    tagline: "El espejo más grande del mundo te espera: camina sobre el cielo al amanecer.",
    mode: "air",
  },
  {
    imageKey: "Rurrenabaque",
    name: "Madidi & Rurrenabaque",
    region: "Amazonía, Beni",
    category: "Aventura",
    badge: "Reserva de la Biósfera",
    rating: 5,
    duration: "4 días • Guía experto",
    priceUSD: 890,
    tagline: "Adéntrate en la selva más biodiversa del planeta y despierta con el rugido del Madidi.",
    mode: "air",
  },
  {
    imageKey: "Santa Cruz",
    name: "Misiones de Chiquitania",
    region: "Santa Cruz, Bolivia",
    category: "Cultura",
    badge: "Patrimonio Mundial UNESCO",
    rating: 5,
    duration: "5 días • Todo incluido",
    priceUSD: 799,
    tagline: "Recorre las iglesias jesuíticas vivas de la Chiquitania, joyas talladas en la selva.",
    mode: "air",
  },
  {
    imageKey: "Copacabana",
    name: "Lago Titicaca",
    region: "La Paz, Bolivia",
    category: "Naturaleza",
    badge: "Lago Sagrado de los Andes",
    rating: 5,
    duration: "2 días • Media pensión",
    priceUSD: 349,
    tagline: "Navega el lago navegable más alto del mundo hacia la mítica Isla del Sol.",
    mode: "bus",
  },
  {
    imageKey: "Sucre",
    name: "Sucre Colonial",
    region: "Chuquisaca, Bolivia",
    category: "Cultura",
    badge: "Patrimonio Mundial UNESCO",
    rating: 5,
    duration: "3 días • Todo incluido",
    priceUSD: 620,
    tagline: "Pierde el aliento entre iglesias blancas y calles empedradas de otro siglo.",
    mode: "air",
  },
  {
    imageKey: "La Paz",
    name: "La Paz & Cordillera Real",
    region: "La Paz, Bolivia",
    category: "Aventura",
    badge: "Techo de los Andes",
    rating: 5,
    duration: "3 días • Teleférico + city",
    priceUSD: 460,
    tagline: "Sube en teleférico sobre la ciudad más alta y roza los nevados de la Cordillera Real.",
    mode: "air",
  },
  {
    imageKey: "Tarija",
    name: "Valles de Tarija",
    region: "Tarija, Bolivia",
    category: "Gastronomía",
    badge: "Ruta del Vino de Altura",
    rating: 5,
    duration: "3 días • Cata incluida",
    priceUSD: 540,
    tagline: "Brinda al sol con los vinos de mayor altitud del mundo entre viñedos infinitos.",
    mode: "air",
  },
  {
    imageKey: "Cochabamba",
    name: "Cochabamba & Valle Alto",
    region: "Cochabamba, Bolivia",
    category: "Gastronomía",
    badge: "Capital Gastronómica",
    rating: 5,
    duration: "2 días • Tour de sabores",
    priceUSD: 390,
    tagline: "Deléitate en el corazón culinario de Bolivia, bajo la mirada del Cristo de la Concordia.",
    mode: "air",
  },
];

/** Destinos internacionales — mismo tratamiento premium, fotografía real por ciudad. */
const INTERNATIONAL: Destination[] = [
  {
    imageKey: "Buenos Aires",
    name: "Buenos Aires",
    region: "Argentina",
    category: "Ciudad",
    badge: "La París de Sudamérica",
    rating: 5,
    duration: "5 días • Hotel + vuelos",
    priceUSD: 1290,
    tagline: "Tango, cafés centenarios y noches sin final en la capital más europea de Sudamérica.",
    mode: "air",
  },
  {
    imageKey: "Río de Janeiro",
    name: "Río de Janeiro",
    region: "Brasil",
    category: "Playa",
    badge: "Ciudad Maravillosa",
    rating: 5,
    duration: "6 días • Todo incluido",
    priceUSD: 1490,
    tagline: "Del Cristo Redentor a Copacabana: samba, playa y postales imposibles.",
    mode: "air",
  },
  {
    imageKey: "Cancún",
    name: "Cancún",
    region: "México",
    category: "Playa",
    badge: "Caribe Mexicano",
    rating: 5,
    duration: "7 días • All inclusive",
    priceUSD: 1690,
    tagline: "Arena blanca, cenotes turquesa y ruinas mayas frente a un mar imposiblemente azul.",
    mode: "air",
  },
  {
    imageKey: "Lima",
    name: "Lima",
    region: "Perú",
    category: "Gastronomía",
    badge: "Capital Gastronómica",
    rating: 5,
    duration: "4 días • Media pensión",
    priceUSD: 890,
    tagline: "La mejor cocina del mundo frente al Pacífico, entre historia colonial y barrios de moda.",
    mode: "air",
  },
  {
    imageKey: "Madrid",
    name: "Madrid",
    region: "España",
    category: "Cultura",
    badge: "Corazón de Europa",
    rating: 5,
    duration: "7 días • Vuelos + hotel",
    priceUSD: 2190,
    tagline: "Arte, tapas y noches infinitas en la capital que nunca duerme.",
    mode: "air",
  },
  {
    imageKey: "Punta Cana",
    name: "Punta Cana",
    region: "Rep. Dominicana",
    category: "Playa",
    badge: "Paraíso Caribeño",
    rating: 5,
    duration: "7 días • All inclusive",
    priceUSD: 1790,
    tagline: "Palmeras, resorts de ensueño y el mar turquesa que solo verás en postales.",
    mode: "air",
  },
  {
    imageKey: "Santiago",
    name: "Santiago",
    region: "Chile",
    category: "Aventura",
    badge: "Andes & Viñas",
    rating: 5,
    duration: "5 días • Hotel + tours",
    priceUSD: 1090,
    tagline: "Rascacielos a los pies de los Andes y valles de vino a una hora de la ciudad.",
    mode: "air",
  },
  {
    imageKey: "São Paulo",
    name: "São Paulo",
    region: "Brasil",
    category: "Ciudad",
    badge: "Metrópoli Vibrante",
    rating: 5,
    duration: "5 días • Hotel + vuelos",
    priceUSD: 1190,
    tagline: "La megaciudad que late 24/7: arte, gastronomía y una energía que no se apaga.",
    mode: "air",
  },
  {
    imageKey: "Bogotá",
    name: "Bogotá",
    region: "Colombia",
    category: "Cultura",
    badge: "Andes Colombianos",
    rating: 5,
    duration: "4 días • Media pensión",
    priceUSD: 950,
    tagline: "Barrios coloridos, café de altura y montañas que abrazan la ciudad.",
    mode: "air",
  },
  {
    imageKey: "Miami",
    name: "Miami",
    region: "Estados Unidos",
    category: "Playa",
    badge: "Sol & Glamour",
    rating: 5,
    duration: "6 días • Hotel + vuelos",
    priceUSD: 2290,
    tagline: "Art déco, playas de neón y noches de lujo en la puerta de las Américas.",
    mode: "air",
  },
];

const SCOPES = {
  nacional: { list: NATIONAL, label: "Nacionales", emoji: "🇧🇴" },
  internacional: { list: INTERNATIONAL, label: "Internacionales", emoji: "🌎" },
} as const;

type Scope = keyof typeof SCOPES;

const USD = new Intl.NumberFormat("en-US");
const AUTOPLAY_MS = 7000;
const pad = (n: number) => String(n).padStart(2, "0");

/** Variantes de deslizamiento direccional (Apple-like: fade + slide + escala leve). */
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? "8%" : "-8%", scale: 1.04 }),
  center: { opacity: 1, x: "0%", scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? "-6%" : "6%", scale: 1.02 }),
};

export function HeroDestinations() {
  const reduce = useReducedMotion();
  const [scope, setScope] = useState<Scope>("nacional");
  const list = SCOPES[scope].list;
  const total = list.length;
  // [índice, dirección] — la dirección alimenta la animación de entrada/salida.
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const active = wrap(0, total, page);
  const dest = list[active];

  const paginate = useCallback((dir: number) => {
    setPage(([p]) => [p + dir, dir]);
  }, []);

  const goTo = useCallback(
    (i: number) => setPage(([p]) => [i, i > wrap(0, total, p) ? 1 : -1]),
    [total],
  );

  const switchScope = useCallback((next: Scope) => {
    setScope(next);
    setPage([0, 0]);
  }, []);

  // Teclado: ←/→ cambian de destino cuando el carrusel tiene foco.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); paginate(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); paginate(-1); }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power < -60) paginate(1);
    else if (power > 60) paginate(-1);
    setPaused(false);
  };

  // Fallback de autoplay para reduced-motion (sin barra CSS que dispare el avance).
  useEffect(() => {
    if (!reduce || paused) return;
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [reduce, paused, page, paginate]);

  return (
    <section id="destinos" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      {/* Encabezado */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow justify-center">Destinos de ensueño</span>
          <h2 className="mt-3 text-balance font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Viajes que se sienten <span className="text-gradient">antes de partir</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Experiencias curadas dentro y fuera de Bolivia. Desliza, elige la tuya y reserva en minutos.
          </p>
        </motion.div>

        {/* Toggle Nacionales / Internacionales (pill segmentado) */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full bg-surface-2 p-1.5 shadow-[var(--shadow-sm)]">
            {(Object.keys(SCOPES) as Scope[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => switchScope(id)}
                aria-pressed={scope === id}
                className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-7"
              >
                {scope === id && (
                  <motion.span
                    layoutId="hero-dest-scope-pill"
                    className="absolute inset-0 rounded-full bg-foreground shadow-[var(--shadow-sm)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 inline-flex items-center gap-1.5 transition-colors",
                    scope === id ? "text-background" : "text-muted-foreground",
                  )}
                >
                  <span aria-hidden>{SCOPES[id].emoji}</span>
                  {SCOPES[id].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Escenario del carrusel */}
      <div className="mx-auto mt-10 max-w-[1400px] px-4 sm:mt-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className={cn(
            "group relative isolate select-none overflow-hidden rounded-3xl",
            "h-[560px] shadow-[var(--shadow-lg)] outline-none sm:h-[600px] lg:h-[640px]",
            "ring-1 ring-black/5 dark:ring-white/10",
          )}
          role="group"
          aria-roledescription="carrusel"
          aria-label="Destinos destacados"
          tabIndex={0}
          onKeyDown={onKey}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Diapositiva activa (fotografía + capas de profundidad + contenido) */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.article
              key={`${scope}-${active}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 260, damping: 32 },
                opacity: { duration: 0.5, ease: EASE_OUT },
                scale: { duration: 0.6, ease: EASE_OUT },
              }}
              className="absolute inset-0"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              dragMomentum={false}
              onDragStart={() => setPaused(true)}
              onDragEnd={onDragEnd}
              aria-roledescription="diapositiva"
              aria-label={`${active + 1} de ${total}: ${dest.name}`}
            >
              {/* Capa 1 — fotografía nítida con Ken Burns muy leve */}
              <div className={cn("absolute inset-0", !reduce && "ken-burns")}>
                <SmartImage
                  image={DESTINATION_IMAGES[dest.imageKey] ?? DESTINATION_IMAGES.Uyuni}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  priority={active === 0}
                  imgClassName="object-cover"
                />
              </div>

              {/* Capa 2 — blur progresivo hacia los bordes (profundidad / glass) */}
              <div
                className="pointer-events-none absolute inset-0 backdrop-blur-[7px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, #000 0%, transparent 15%, transparent 85%, #000 100%)",
                  maskImage:
                    "linear-gradient(to right, #000 0%, transparent 15%, transparent 85%, #000 100%)",
                }}
                aria-hidden
              />

              {/* Capa 3 — scrim para legibilidad del texto (abajo + izquierda) */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,8,18,0.82) 0%, rgba(6,8,18,0.45) 34%, transparent 62%), linear-gradient(to right, rgba(6,8,18,0.6) 0%, transparent 55%)",
                }}
                aria-hidden
              />
              {/* Capa 4 — tinte de marca muy sutil + viñeta */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15"
                aria-hidden
              />

              {/* Contenido — bloque de información sobre la fotografía */}
              <div className="absolute inset-0 flex items-end">
                <motion.div
                  key={`info-${scope}-${active}`}
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
                  className="w-full max-w-2xl p-6 sm:p-10 lg:p-12"
                >
                  <Line>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        <MapPin className="h-3 w-3" aria-hidden />
                        Destino
                      </span>
                      <span className="rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[var(--shadow-sm)] backdrop-blur-sm">
                        {dest.category}
                      </span>
                    </div>
                  </Line>

                  <Line>
                    <h3 className="mt-4 text-balance font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight text-white text-on-photo sm:text-5xl lg:text-6xl">
                      {dest.name}
                    </h3>
                  </Line>

                  <Line>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90 text-on-photo">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-white/70" aria-hidden />
                        {dest.region}
                      </span>
                      <span className="inline-flex items-center gap-0.5" aria-label={`${dest.rating} de 5 estrellas`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < dest.rating ? "fill-warning text-warning" : "text-white/30",
                            )}
                            aria-hidden
                          />
                        ))}
                      </span>
                    </div>
                  </Line>

                  <Line>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {dest.badge}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {dest.duration}
                      </span>
                    </div>
                  </Line>

                  <Line>
                    <p className="mt-4 max-w-md text-balance text-base leading-relaxed text-white/90 text-on-photo sm:text-lg">
                      {dest.tagline}
                    </p>
                  </Line>

                  <Line>
                    <div className="mt-5 flex items-end gap-2">
                      <span className="text-sm text-white/70">Desde</span>
                      <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-white text-on-photo sm:text-4xl">
                        ${USD.format(dest.priceUSD)}
                      </span>
                      <span className="pb-1 text-sm font-medium text-white/70">USD</span>
                    </div>
                  </Line>

                  <Line>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/buscar?mode=${dest.mode}`}
                        className={cn(
                          "group/cta inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5",
                          "text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]",
                          "transition-all duration-300 hover:scale-[1.03] hover:gap-3 hover:brightness-110",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        )}
                      >
                        Reservar ahora
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                      </Link>
                      <Link
                        href="#buscador"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5",
                          "text-sm font-semibold text-white backdrop-blur-md",
                          "transition-all duration-300 hover:border-white/70 hover:bg-white/20",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        )}
                      >
                        Más información
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Line>
                </motion.div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Flechas minimalistas (glass) */}
          <NavArrow direction="prev" onClick={() => paginate(-1)} />
          <NavArrow direction="next" onClick={() => paginate(1)} />

          {/* Contador 01 / 08 */}
          <div className="pointer-events-none absolute right-6 top-6 z-20 font-[family-name:var(--font-display)] text-sm font-semibold tabular-nums text-white text-on-photo">
            <span className="text-lg">{pad(active + 1)}</span>
            <span className="mx-1 text-white/50">/</span>
            <span className="text-white/60">{pad(total)}</span>
          </div>

          {/* Barra de progreso del autoplay (se congela en hover/foco) */}
          <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/15">
            {!reduce && (
              <div
                key={`${scope}-${active}`}
                className="carousel-progress-bar h-full bg-gradient-to-r from-primary to-accent"
                style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                onAnimationEnd={() => paginate(1)}
              />
            )}
          </div>
        </motion.div>

        {/* Puntos de navegación */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {list.map((d, i) => (
            <button
              key={d.name}
              type="button"
              aria-label={`Ir a ${d.name}`}
              aria-current={active === i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                active === i
                  ? "w-8 bg-gradient-to-r from-primary to-accent"
                  : "w-2.5 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          <span className="md:hidden">Desliza para explorar los destinos</span>
          <span className="hidden md:inline">Usa las flechas, los puntos o desliza para explorar</span>
        </p>
      </div>
    </section>
  );
}

/** Ítem del bloque de info: sube y aparece (fade + slide) en cascada. */
function Line({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Flecha lateral minimalista con efecto glass (oculta en móvil: se usa swipe). */
function NavArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Destino anterior" : "Destino siguiente"}
      className={cn(
        "absolute top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full md:flex",
        "h-12 w-12 border border-white/30 bg-white/10 text-white backdrop-blur-md",
        "opacity-0 transition-all duration-300 group-hover:opacity-100",
        "hover:scale-110 hover:border-white/60 hover:bg-white/20",
        "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        isPrev ? "left-4" : "right-4",
      )}
    >
      {isPrev ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
    </button>
  );
}
