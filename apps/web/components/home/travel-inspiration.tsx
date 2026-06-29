import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { SmartImage } from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturedArticle, type Article } from "@/components/home/featured-article";
import { DESTINATION_IMAGES } from "@/lib/images";

const ARTICLES: Article[] = [
  {
    title: "Guía completa para visitar el Salar de Uyuni",
    excerpt: "Cuándo ir, qué llevar y los tours que valen cada minuto en el desierto de sal más grande del mundo.",
    category: "Destinos",
    tone: "primary",
    author: "Valeria Ñaupari",
    date: "24 jun 2026",
    readingTime: 8,
    image: DESTINATION_IMAGES["Uyuni"],
  },
  {
    title: "Qué hacer en La Paz durante un fin de semana",
    excerpt: "Teleférico, mercados y la mejor altura: un itinerario para exprimir la ciudad en 48 horas.",
    category: "Guía",
    tone: "accent",
    author: "Mateo Linares",
    date: "19 jun 2026",
    readingTime: 6,
    image: DESTINATION_IMAGES["La Paz"],
  },
  {
    title: "Guía para conocer el Lago Titicaca",
    excerpt: "Isla del Sol, Copacabana y cómo llegar desde La Paz sin complicaciones.",
    category: "Destinos",
    tone: "primary",
    author: "Camila Rosales",
    date: "14 jun 2026",
    readingTime: 7,
    image: DESTINATION_IMAGES["Copacabana"],
  },
  {
    title: "Cómo visitar Madidi desde Rurrenabaque",
    excerpt: "Pampas, selva y biodiversidad: la puerta amazónica de Bolivia, paso a paso.",
    category: "Aventura",
    tone: "success",
    author: "Diego Fuentes",
    date: "9 jun 2026",
    readingTime: 9,
    image: DESTINATION_IMAGES["Rurrenabaque"],
  },
  {
    title: "Los mejores restaurantes de Cochabamba",
    excerpt: "La capital gastronómica de Bolivia, plato por plato: dónde comer como local.",
    category: "Gastronomía",
    tone: "warning",
    author: "Lucía Áñez",
    date: "3 jun 2026",
    readingTime: 5,
    image: DESTINATION_IMAGES["Cochabamba"],
  },
  {
    title: "Viajar en BoA: consejos y recomendaciones",
    excerpt: "Equipaje, check-in y trucos para volar por Bolivia al mejor precio.",
    category: "Consejos",
    tone: "accent",
    author: "Joaquín Camacho",
    date: "28 may 2026",
    readingTime: 6,
    image: DESTINATION_IMAGES["Santa Cruz"],
  },
];

export function TravelInspiration() {
  const [featured, ...rest] = ARTICLES;

  return (
    <Section id="inspiracion">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          className="flex-1"
          eyebrow="Revista FlyAlways"
          title={
            <>
              <span className="text-gradient">Inspiración</span> para descubrir Bolivia
            </>
          }
          subtitle="Guías, consejos prácticos y destinos que despiertan ganas de salir. Historias para que cada viaje empiece mucho antes de partir."
        />
        <Reveal className="shrink-0">
          <RevealItem variant="fade">
            <Link href="#" className="group inline-flex">
              <Button
                variant="outline"
                className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[var(--shadow-glow)]"
              >
                Ver todas las guías
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </RevealItem>
        </Reveal>
      </div>

      <Reveal wide className="mt-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Artículo destacado con parallax. */}
          <RevealItem variant="blur" className="lg:col-span-2 lg:row-span-2">
            <FeaturedArticle article={featured} />
          </RevealItem>

          {/* Artículos secundarios. */}
          {rest.map((article) => (
            <RevealItem key={article.title} variant="blur" className="h-full">
              <ArticleCard article={article} />
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href="#"
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          image={article.image}
          sizes="(max-width: 1024px) 100vw, 33vw"
          imgClassName="transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute left-4 top-4">
          <Badge tone={article.tone} className="backdrop-blur-sm">
            {article.category}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-balance font-[family-name:var(--font-display)] text-lg font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{article.author}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {article.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime} min
          </span>
          <ArrowUpRight className="ml-auto h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
