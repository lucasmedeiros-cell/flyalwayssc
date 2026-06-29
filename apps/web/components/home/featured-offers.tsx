"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Heart, Plane, Star, TrendingDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { SmartImage } from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { FlashCountdown } from "@/components/home/flash-countdown";
import { DESTINATION_IMAGES, type CuratedImage } from "@/lib/images";
import { SPRING_SOFT, fadeUp, staggerContainerWide } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BadgeKind = "flash" | "best" | "web" | "popular" | "last";

type Offer = {
  origin: string;
  destination: string;
  image: CuratedImage;
  oldPrice: number;
  newPrice: number;
  seatsLeft: number;
  viewers: number;
  lastBookedMin: number;
  badge: BadgeKind;
  recommended?: boolean;
};

const OFFERS: Offer[] = [
  { origin: "La Paz", destination: "Uyuni", image: DESTINATION_IMAGES["Uyuni"], oldPrice: 1200, newPrice: 780, seatsLeft: 3, viewers: 24, lastBookedMin: 2, badge: "flash", recommended: true },
  { origin: "Santa Cruz", destination: "La Paz", image: DESTINATION_IMAGES["La Paz"], oldPrice: 980, newPrice: 686, seatsLeft: 8, viewers: 18, lastBookedMin: 5, badge: "popular" },
  { origin: "Santa Cruz", destination: "Sucre", image: DESTINATION_IMAGES["Sucre"], oldPrice: 720, newPrice: 518, seatsLeft: 5, viewers: 12, lastBookedMin: 8, badge: "best" },
  { origin: "La Paz", destination: "Rurrenabaque", image: DESTINATION_IMAGES["Rurrenabaque"], oldPrice: 990, newPrice: 743, seatsLeft: 4, viewers: 15, lastBookedMin: 3, badge: "web" },
  { origin: "Santa Cruz", destination: "Tarija", image: DESTINATION_IMAGES["Tarija"], oldPrice: 880, newPrice: 598, seatsLeft: 2, viewers: 21, lastBookedMin: 1, badge: "last" },
  { origin: "Santa Cruz", destination: "Cochabamba", image: DESTINATION_IMAGES["Cochabamba"], oldPrice: 540, newPrice: 421, seatsLeft: 12, viewers: 9, lastBookedMin: 11, badge: "best" },
];

const FILTERS = ["Todas", "Último minuto", "Fin de semana", "Nacionales", "Internacionales"] as const;

const STATS = [
  { icon: Flame, value: 1240, suffix: "", label: "ofertas activas" },
  { icon: Plane, value: 520, suffix: "", label: "destinos" },
  { icon: TrendingDown, value: 70, suffix: "%", label: "de descuento máx." },
  { icon: Star, value: 98, suffix: "%", label: "satisfacción" },
];

const BOB = new Intl.NumberFormat("es-BO");

export function FeaturedOffers() {
  return (
    <AnimatedSection id="ofertas">
      {/* Partículas decorativas muy sutiles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {[
          { left: "12%", top: "18%", d: 0 },
          { left: "82%", top: "26%", d: 1.2 },
          { left: "68%", top: "70%", d: 2.1 },
          { left: "28%", top: "78%", d: 0.6 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/40 blur-[1px]"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: p.d }}
          />
        ))}
      </div>

      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <RevealItem variant="blur" className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-danger">
              <motion.span
                animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 0] }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
              >
                <Flame className="h-3.5 w-3.5" />
              </motion.span>
              Flash Sale · Solo hoy
            </span>
            <h2 className="mt-4 text-balance font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Vuela por <span className="text-gradient">mucho menos</span>
            </h2>
            <p className="mt-3 text-balance text-muted-foreground sm:text-lg">
              Tarifas exclusivas que caen en picada. Cuando se agotan, se agotan — y hoy
              están volando rápido.
            </p>
          </RevealItem>

          <RevealItem variant="scale">
            <div className="glass inline-flex items-center rounded-2xl border border-border px-5 py-3.5 shadow-[var(--shadow-md)]">
              <FlashCountdown />
            </div>
          </RevealItem>
        </div>
      </Reveal>

      {/* Estadísticas */}
      <Reveal wide className="mt-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-surface/70 p-5 backdrop-blur-sm sm:p-6 md:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label} variant="scale" className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <span>
                <CountUp
                  value={s.value}
                  suffix={s.suffix}
                  className="font-[family-name:var(--font-display)] text-xl font-bold text-gradient sm:text-2xl"
                />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </span>
            </RevealItem>
          ))}
        </div>
      </Reveal>

      {/* Chips de filtro premium con sliding pill */}
      <Reveal className="mt-8">
        <RevealItem variant="fade">
          <ChipFilters />
        </RevealItem>
      </Reveal>

      {/* Grilla de ofertas */}
      <motion.div
        variants={staggerContainerWide}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {OFFERS.map((offer) => (
          <OfferCard key={`${offer.origin}-${offer.destination}`} offer={offer} />
        ))}
      </motion.div>
    </AnimatedSection>
  );
}

function ChipFilters() {
  const [active, setActive] = useState(0);
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((f, i) => {
        const on = i === active;
        return (
          <motion.button
            key={f}
            type="button"
            onClick={() => setActive(i)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on
                ? "text-primary-foreground"
                : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {on && (
              <motion.span
                layoutId="offers-chip"
                className="absolute inset-0 rounded-full bg-primary shadow-[var(--shadow-glow)]"
                transition={SPRING_SOFT}
              />
            )}
            <span className="relative z-10">{f}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const discount = Math.round((1 - offer.newPrice / offer.oldPrice) * 100);
  const savings = offer.oldPrice - offer.newPrice;
  const lowSeats = offer.seatsLeft <= 6;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={SPRING_SOFT}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)] transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
    >
      {/* Imagen protagonista */}
      <div className="relative h-48 overflow-hidden">
        <SmartImage
          image={offer.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

        {/* Un solo badge: el descuento */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm">
          −{discount}%
        </span>

        <FavoriteButton />

        {/* Destino + ruta */}
        <div className="absolute inset-x-4 bottom-3.5 text-white">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-on-photo">
            {offer.destination}
          </h3>
          <p className="mt-0.5 text-xs text-white/80">
            {offer.origin} → {offer.destination}
          </p>
        </div>
      </div>

      {/* Cuerpo: precio · ahorro · disponibilidad · botón */}
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-foreground">
              Bs {BOB.format(offer.newPrice)}
            </span>
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              Bs {BOB.format(offer.oldPrice)}
            </span>
          </div>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Ahorras Bs {BOB.format(savings)}
          </span>
        </div>

        {lowSeats && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
            </span>
            {offer.seatsLeft <= 3 ? "Últimos lugares" : `Quedan ${offer.seatsLeft} asientos`}
          </span>
        )}

        <Link href="/buscar?mode=air" className="mt-auto">
          <Button size="lg" className="w-full">
            Reservar
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}

function FavoriteButton() {
  const [fav, setFav] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setFav((v) => !v)}
      whileTap={{ scale: 0.8 }}
      aria-label={fav ? "Quitar de favoritos" : "Guardar oferta"}
      aria-pressed={fav}
      className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
    >
      <Heart className={cn("h-4 w-4 transition-all", fav && "scale-110 fill-danger text-danger")} />
    </motion.button>
  );
}
