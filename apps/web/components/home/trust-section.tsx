"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  CalendarHeart,
  CheckCircle2,
  Headphones,
  Lock,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section";
import { CountUp } from "@/components/ui/count-up";
import { LivePulse } from "@/components/ui/live-pulse";
import { SPRING_SOFT, fadeUp, staggerContainerWide } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Stat = { icon: LucideIcon; value: number; suffix?: string; label: string };

const STATS: Stat[] = [
  { icon: Users, value: 500000, suffix: "+", label: "Viajeros felices" },
  { icon: ShieldCheck, value: 850000, suffix: "+", label: "Reservas realizadas" },
  { icon: Star, value: 98, suffix: "%", label: "Satisfacción" },
  { icon: BadgeCheck, value: 300, suffix: "+", label: "Operadores verificados" },
];

type Trust = { icon: LucideIcon; title: string; benefit: string; span?: string };

const TRUST_CARDS: Trust[] = [
  {
    icon: ShieldCheck,
    title: "Protección del comprador",
    benefit: "Si algo no sale como esperabas, tu reserva está respaldada por FlyAlways de principio a fin.",
    span: "lg:col-span-2",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7 en Bolivia",
    benefit: "Un equipo real te acompaña antes, durante y después de tu viaje.",
  },
  {
    icon: CalendarHeart,
    title: "Cancelación flexible",
    benefit: "Cambios y reembolsos claros, sin letra chica ni sorpresas.",
  },
];

const BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: Lock, label: "Pago cifrado" },
  { icon: ShieldCheck, label: "Conexión SSL" },
  { icon: RefreshCcw, label: "Reembolso garantizado" },
  { icon: BadgeCheck, label: "Empresas verificadas" },
  { icon: MapPin, label: "Soporte en Bolivia" },
  { icon: CheckCircle2, label: "Sin costos ocultos" },
];

export function TrustSection() {
  return (
    <AnimatedSection id="confianza">
      <SectionHeading
        align="center"
        eyebrow="🔒 Reserva protegida"
        title="Reserva con total tranquilidad"
        subtitle="Tu dinero protegido, tus datos cifrados y respaldo humano en cada paso. Así cuidamos cada reserva que haces con nosotros."
      />

      {/* Estadísticas — protagonistas */}
      <motion.div
        variants={staggerContainerWide}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </motion.div>

      {/* Bento: escudo central + tarjetas de confianza */}
      <motion.div
        variants={staggerContainerWide}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[11rem]"
      >
        <ShieldCenterpiece />
        {TRUST_CARDS.map((c) => (
          <TrustCard key={c.title} card={c} />
        ))}
      </motion.div>

      {/* Badges de seguridad */}
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        {BADGES.map((b) => (
          <li
            key={b.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <b.icon className="h-3.5 w-3.5 text-success" />
            {b.label}
          </li>
        ))}
      </motion.ul>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
      >
        <span className="inline-flex items-center gap-2">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
            ))}
          </span>
          <span className="font-medium text-foreground">Miles de viajeros confían en nosotros</span>
        </span>
        <LivePulse tone="success" className="text-muted-foreground">
          Última reserva hace 2 min
        </LivePulse>
      </motion.div>
    </AnimatedSection>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={SPRING_SOFT}
      className="group relative overflow-hidden rounded-3xl border border-border bg-surface/80 p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-110">
        <stat.icon className="h-5 w-5" />
      </span>
      <CountUp
        value={stat.value}
        suffix={stat.suffix}
        className="mt-3 block font-[family-name:var(--font-display)] text-3xl font-bold text-gradient sm:text-4xl"
      />
      <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

function TrustCard({ card }: { card: Trust }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={SPRING_SOFT}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/80 p-6 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]",
        card.span,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <card.icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{card.benefit}</p>
    </motion.div>
  );
}

/** Bonus: visualización central de seguridad — escudo con anillos que pulsan. */
function ShieldCenterpiece() {
  const ringVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-surface to-accent/[0.08] p-8 text-center shadow-[var(--shadow-md)] lg:col-span-2 lg:row-span-2"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-25" />

      <motion.div variants={ringVariants} className="relative flex h-40 w-40 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-2 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: "easeOut" }}
          />
        ))}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <ShieldCheck className="h-11 w-11" />
        </motion.div>
      </motion.div>

      <h3 className="relative mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        100% Protegido
      </h3>
      <p className="relative mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Pago cifrado, reembolso garantizado y protección del comprador en cada reserva que haces.
      </p>
      <div className="relative mt-4 flex flex-wrap justify-center gap-2">
        {["SSL seguro", "Pago cifrado", "Reembolso"].map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Lock className="h-3 w-3 text-success" />
            {b}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
