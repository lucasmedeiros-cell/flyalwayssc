import { Hero } from "@/components/home/hero";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { FeaturedOffers } from "@/components/home/featured-offers";
import { StatsStrip } from "@/components/home/stats-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { PartnersStrip } from "@/components/home/partners-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <FeaturedOffers />
      <StatsStrip />
      <HowItWorks />
      <Testimonials />
      <PartnersStrip />
    </>
  );
}
