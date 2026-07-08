import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "De la búsqueda al despegue en tres pasos, sin fricción ni sorpresas. Descubre lo fácil que es reservar tu vuelo con FlyAlways.",
};

export default function ComoFuncionaPage() {
  return (
    <div className="pt-8">
      <HowItWorks />
    </div>
  );
}
