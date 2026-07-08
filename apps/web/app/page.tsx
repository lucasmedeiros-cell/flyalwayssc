import { getDataSource } from "@/lib/services";
import { Hero } from "@/components/home/hero";
import { DestinationsShowcase } from "@/components/home/destinations-showcase";
import { PromoBanner } from "@/components/home/promo-banner";
import { FeaturedOffers } from "@/components/home/featured-offers";
import { Testimonials } from "@/components/home/testimonials";
import { PartnersStrip } from "@/components/home/partners-strip";

export default async function HomePage() {
  const promo = await getDataSource().getPromo();
  return (
    <>
      {/* Hero principal: diseño original (foto + titular + buscador). */}
      <Hero />

      {/* Producto destacado — entre el hero y la sección de destinos. */}
      {promo && <PromoBanner promo={promo} />}

      <DestinationsShowcase />
      <FeaturedOffers />
      <Testimonials />
      <PartnersStrip />
    </>
  );
}
