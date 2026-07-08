"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SearchPanel } from "@/components/search/search-panel";
import { SmartImage } from "@/components/ui/smart-image";
import { FlyingPlane } from "@/components/common/flying-plane";
import { HERO_IMAGE } from "@/lib/images";
import { fadeUpBlur, staggerContainer } from "@/lib/motion";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden">
      {/* Fotografía aspiracional full-bleed (cae al gradiente de marca si falla). */}
      <div className="absolute inset-0 -z-10">
        <SmartImage image={HERO_IMAGE} priority sizes="100vw" imgClassName="scale-105" />
        {/* Scrim para legibilidad + fundido con el fondo de la página.
            Theme-aware: en modo CLARO el velo es más oscuro (mejor contraste del
            texto blanco); en modo OSCURO se aclara para que la foto se vea más
            nítida. El `to-background` mantiene el fondo del buscador legible en
            ambos temas. */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-background dark:from-slate-950/40 dark:via-slate-950/25" />
        {/* Tinte de marca sutil (más discreto en oscuro para no ensuciar la foto). */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/35 via-transparent to-accent/25 dark:from-primary/20 dark:to-accent/15" />
      </div>

      {/* Avioncito que cruza el hero para captar la atención al ingresar. */}
      <FlyingPlane className="pointer-events-none absolute inset-0 z-0 overflow-hidden" size={34} />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUpBlur} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Vuelos nacionales e internacionales — toda Bolivia despega aquí
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpBlur}
            className="mt-6 text-balance font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.04] tracking-tight text-white text-on-photo sm:text-6xl"
          >
            Tu próximo viaje,{" "}
            <span className="bg-gradient-to-r from-[#c3b9ff] to-[#ffb3b3] bg-clip-text text-transparent">
              en un solo lugar.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpBlur}
            className="mx-auto mt-5 max-w-xl text-balance text-base text-white/85 text-on-photo sm:text-lg"
          >
            Compara vuelos de las mejores aerolíneas por toda Bolivia y al mundo.
            Reserva en bolivianos, con precio transparente, cancelación flexible y soporte
            nacional cuando lo necesites.
          </motion.p>

          {/* Prueba social inmediata: rating + volumen de viajeros. */}
          <motion.div
            variants={fadeUpBlur}
            className="mt-5 flex items-center justify-center gap-2 text-sm text-white/90 text-on-photo"
          >
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </span>
            <span className="font-semibold">4.9/5</span>
            <span className="text-white/70">· +500.000 viajeros en Bolivia</span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          id="buscador"
          className="mx-auto mt-10 max-w-5xl scroll-mt-24"
        >
          <SearchPanel />
        </motion.div>
      </div>
    </section>
  );
}
