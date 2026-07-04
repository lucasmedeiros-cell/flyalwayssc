import { getDataSource } from "@/lib/services";
import { Hero } from "@/components/home/hero";
import { HeroDestinations } from "@/components/home/hero-destinations";
import { PromoBanner } from "@/components/home/promo-banner";
import { FeaturedOffers } from "@/components/home/featured-offers";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { PartnersStrip } from "@/components/home/partners-strip";

export default async function HomePage() {
  const promo = await getDataSource().getPromo();
  return (
    <>
      <Hero />
      <HeroDestinations />
      {promo && <PromoBanner promo={promo} />}
      <FeaturedOffers />
      <HowItWorks />
      <Testimonials />
      <PartnersStrip />
    </>
  );
}
