import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TRANSPORT_MODES, TRANSPORT_MODE_META } from "@vialta/types";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

const COPY: Record<string, string> = {
  air: "Vuelos por toda Bolivia y al mundo con tarifas claras, desde BoA hasta LATAM.",
  bus: "Rutas terrestres cómodas con asientos cama y servicios a bordo, en todo el país.",
  train: "Viaja por el altiplano: rutas como Oruro–Uyuni, panorámicas y puntuales.",
  private: "Vans y autos privados con conductor, a tu horario y a tu ritmo.",
};

export function ModesSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Multimodal"
        title={
          <>
            Una plataforma, <span className="text-gradient">cuatro formas de moverte</span>
          </>
        }
        subtitle="Cambia de avión a bus, tren o flota privada sin cambiar de app. Cada modo adapta los filtros y resultados a lo que de verdad importa en ese viaje."
      />

      <Reveal wide className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSPORT_MODES.map((mode) => {
            const meta = TRANSPORT_MODE_META[mode];
            return (
              <RevealItem key={mode} variant="blur">
                <Link
                  href={`/buscar?mode=${mode}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="inline-block text-3xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:-rotate-6">
                    {meta.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{meta.label}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{COPY[mode]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explorar
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
