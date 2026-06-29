import { AnimatedSection } from "@/components/ui/animated-section";
import {
  TestimonialCarousel,
  type CarouselStat,
  type Testimonial,
} from "@/components/testimonials/testimonial-carousel";

const STATS: CarouselStat[] = [
  { value: 98, suffix: "%", label: "Satisfacción" },
  { value: 120000, label: "Reservas completadas" },
  { value: 4.9, decimals: 1, label: "Calificación media" },
  { value: 300, suffix: "+", label: "Empresas aliadas" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Camila Rojas",
    city: "Santa Cruz de la Sierra",
    tripType: "Vuelo · Santa Cruz → La Paz",
    company: "Boliviana de Aviación",
    text: "Comparé bus y vuelo en la misma pantalla y reservé en menos de un minuto. El ticket digital llegó al instante y todo el proceso se sintió de otra liga.",
    rating: 5,
    date: "Hace 1 semana",
    kind: "verified",
  },
  {
    name: "Diego Camacho",
    city: "La Paz",
    tripType: "Vuelo · La Paz → Cochabamba",
    company: "Boliviana de Aviación",
    text: "El seguimiento del vuelo en tiempo real me dio una tranquilidad enorme. Sabía exactamente cuándo salía y llegaba. Repetiré sin dudarlo.",
    rating: 5,
    date: "Hace 2 semanas",
    kind: "frequent",
  },
  {
    name: "Valeria Suárez",
    city: "Cochabamba",
    tripType: "Vuelo · La Paz → Uyuni",
    company: "Boliviana de Aviación",
    text: "Encontré pasajes para toda mi familia a un precio justo, sin cargos ocultos. La atención respondió en minutos cuando tuve una duda.",
    rating: 4,
    date: "Hace 3 semanas",
    kind: "confirmed",
  },
  {
    name: "Mateo Vargas",
    city: "Sucre",
    tripType: "Vuelo · Sucre → Santa Cruz",
    company: "Boliviana de Aviación",
    text: "El vuelo salió puntual y todo fue impecable. Poder filtrar por horario y servicios antes de pagar marcó la diferencia.",
    rating: 5,
    date: "Hace 1 mes",
    kind: "verified",
  },
  {
    name: "Antonia Mendoza",
    city: "Tarija",
    tripType: "Vuelo · Tarija → Santa Cruz",
    company: "Boliviana de Aviación",
    text: "Necesité cancelar y me reembolsaron sin complicaciones. Una plataforma seria que da confianza de verdad. Por fin viajar sin estrés.",
    rating: 5,
    date: "Hace 1 mes",
    kind: "frequent",
  },
  {
    name: "Joaquín Áñez",
    city: "Oruro",
    tripType: "Vuelo · Cochabamba → La Paz",
    company: "Boliviana de Aviación",
    text: "Me encanta poder elegir asiento y equipaje antes de pagar. Todo claro, sin sorpresas en el precio final. Así debería ser siempre.",
    rating: 5,
    date: "Hace 2 meses",
    kind: "verified",
  },
];

export function Testimonials() {
  return (
    <AnimatedSection id="opiniones">
      <TestimonialCarousel
        eyebrow="Historias reales"
        title={
          <>
            Lo que dicen quienes <span className="text-gradient">ya viajaron</span>
          </>
        }
        subtitle="Miles de viajeros eligen FlyAlways cada mes y vuelven a reservar. Estas son algunas de sus experiencias verificadas."
        stats={STATS}
        items={TESTIMONIALS}
      />
    </AnimatedSection>
  );
}
