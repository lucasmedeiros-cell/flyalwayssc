import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { DESTINATION_IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

type Tag = "Tendencia" | "🔥 Popular" | null;

type Destination = {
  name: string;
  country: string;
  from: number;
  mode: "air" | "bus" | "train" | "private";
  tag: Tag;
  /** Card destacada (ocupa más espacio en el mosaico). */
  featured?: boolean;
};

const FILTERS = ["Tendencia", "Playas", "Montañas", "Ciudades", "Escapadas de finde"] as const;

const DESTINATIONS: Destination[] = [
  { name: "Uyuni", country: "Potosí, Bolivia", from: 690, mode: "air", tag: "🔥 Popular", featured: true },
  { name: "La Paz", country: "Bolivia", from: 420, mode: "air", tag: "Tendencia" },
  { name: "Santa Cruz", country: "Bolivia", from: 480, mode: "air", tag: null },
  { name: "Copacabana", country: "Lago Titicaca", from: 45, mode: "air", tag: "Tendencia" },
  { name: "Sucre", country: "Bolivia", from: 460, mode: "air", tag: null },
  { name: "Rurrenabaque", country: "Madidi, Bolivia", from: 690, mode: "air", tag: "🔥 Popular" },
  { name: "Cochabamba", country: "Bolivia", from: 90, mode: "air", tag: null },
  { name: "Tarija", country: "Bolivia", from: 620, mode: "air", tag: "Tendencia" },
];

const BOB = new Intl.NumberFormat("es-BO");

export function PopularDestinations() {
  return (
    <Section id="destinos">
      <SectionHeading
        eyebrow="Inspiración"
        title={
          <>
            Destinos que <span className="text-gradient">enamoran</span>
          </>
        }
        subtitle="Las rutas que más reservan los viajeros esta temporada, con tarifas reales desde."
      />

      <Reveal wide className="mt-7">
        {/* Chips de filtro visuales (estáticos). */}
        <RevealItem variant="fade" className="flex flex-wrap gap-2">
          {FILTERS.map((filter, i) => (
            <span
              key={filter}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                i === 0
                  ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {filter}
            </span>
          ))}
        </RevealItem>

        {/* Mosaico de destinos: la primera card es destacada. */}
        <div className="mt-8 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {DESTINATIONS.map((dest) => (
            <RevealItem
              key={dest.name}
              variant="scale"
              className={cn(dest.featured && "col-span-2 row-span-2")}
            >
              <Link
                href={`/buscar?mode=${dest.mode}`}
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[var(--shadow-lg)]"
              >
                {/* Fotografía del destino con zoom al hover (cae al gradiente si falla). */}
                <SmartImage
                  image={DESTINATION_IMAGES[dest.name]}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
                {/* Scrim inferior para legibilidad del texto. */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {dest.tag && (
                  <Badge
                    tone={dest.tag === "Tendencia" ? "accent" : "warning"}
                    className="absolute left-4 top-4 backdrop-blur-sm"
                  >
                    {dest.tag}
                  </Badge>
                )}

                {/* Texto que se desliza al hover. */}
                <div className="relative z-10 p-4 text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="h-3 w-3" />
                    {dest.country}
                  </div>
                  <h3
                    className={cn(
                      "font-[family-name:var(--font-display)] font-bold leading-tight text-on-photo",
                      dest.featured ? "text-2xl sm:text-3xl" : "text-lg",
                    )}
                  >
                    {dest.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-white/90">
                      desde <span className="font-semibold text-white">Bs {BOB.format(dest.from)}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
