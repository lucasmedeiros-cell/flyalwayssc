"use client";

import { Plane } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section";
import { OperatorCarousel, type OperatorBrand } from "@/components/operators/operator-carousel";

// Aerolíneas que operan desde/hacia Bolivia (nombres públicos; el logotipo
// oficial se carga desde /public/logos/airlines/{slug} si está disponible).
const OPERATORS: OperatorBrand[] = [
  { name: "Boliviana de Aviación", slug: "boa", icon: Plane, category: "Aéreo", country: "Bolivia", routes: 64, rating: 4.5, years: 18, coverage: "9 ciudades + internacional", color: "#0a2d6e" },
  { name: "EcoJet", slug: "ecojet", icon: Plane, category: "Aéreo", country: "Bolivia", routes: 28, rating: 4.1, years: 12, coverage: "Red nacional", color: "#00aeef" },
  { name: "LATAM Airlines", slug: "latam", icon: Plane, category: "Aéreo", country: "Chile", routes: 120, rating: 4.6, years: 30, coverage: "Sudamérica + Madrid", color: "#1b0088" },
  { name: "Avianca", slug: "avianca", icon: Plane, category: "Aéreo", country: "Colombia", routes: 95, rating: 4.4, years: 20, coverage: "América + Europa", color: "#d31145" },
  { name: "Copa Airlines", slug: "copa", icon: Plane, category: "Aéreo", country: "Panamá", routes: 80, rating: 4.7, years: 25, coverage: "Hub de las Américas", color: "#003da5" },
  { name: "Air Europa", slug: "air-europa", icon: Plane, category: "Aéreo", country: "España", routes: 60, rating: 4.3, years: 38, coverage: "Europa + Sudamérica", color: "#003b95" },
  { name: "Air France", slug: "air-france", icon: Plane, category: "Aéreo", country: "Francia", routes: 110, rating: 4.5, years: 90, coverage: "Cobertura global", color: "#002157" },
  { name: "Iberia", slug: "iberia", icon: Plane, category: "Aéreo", country: "España", routes: 100, rating: 4.4, years: 95, coverage: "Europa + América", color: "#ec1c24" },
  { name: "GOL Linhas Aéreas", slug: "gol", icon: Plane, category: "Aéreo", country: "Brasil", routes: 90, rating: 4.2, years: 24, coverage: "Brasil + regional", color: "#ff7a00" },
  { name: "Aerolíneas Argentinas", slug: "aerolineas-argentinas", icon: Plane, category: "Aéreo", country: "Argentina", routes: 85, rating: 4.1, years: 70, coverage: "Argentina + regional", color: "#00a0e1" },
  { name: "Paranair", slug: "paranair", icon: Plane, category: "Aéreo", country: "Paraguay", routes: 20, rating: 4.0, years: 8, coverage: "Cono Sur", color: "#e2231a" },
];

export function PartnersStrip() {
  return (
    <AnimatedSection id="operadores" className="border-y border-border">
      <SectionHeading
        align="center"
        eyebrow="Red de confianza"
        title="Las aerolíneas líderes vuelan con nosotros"
        subtitle="Las principales aerolíneas que operan desde y hacia Bolivia confían en FlyAlways para llegar a más viajeros."
      />

      <div className="mt-10">
        <OperatorCarousel items={OPERATORS} />
      </div>
    </AnimatedSection>
  );
}
