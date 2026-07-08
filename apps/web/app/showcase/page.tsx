import type { Metadata } from "next";
import { TripShowcase } from "@/components/showcase/trip-showcase";

export const metadata: Metadata = {
  title: "Tu próximo destino",
  description: "Descubre tu próximo viaje con FlyAlways: precio, itinerario y comodidades en un vistazo.",
};

export default function ShowcasePage() {
  return <TripShowcase />;
}
