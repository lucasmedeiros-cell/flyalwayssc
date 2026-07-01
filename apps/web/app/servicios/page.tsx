import type { Metadata } from "next";
import { ServicesView } from "@/components/services/services-view";

export const metadata: Metadata = {
  title: "Servicios para tu viaje",
  description:
    "Suma hoteles, tours, alquiler de autos, seguros, actividades, excursiones y más a tu viaje. Arma tu itinerario completo sin salir de FlyAlways.",
};

export default function ServiciosPage() {
  return <ServicesView />;
}
