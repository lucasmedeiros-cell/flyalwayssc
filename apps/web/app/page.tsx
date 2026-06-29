import { Hero } from "@/components/home/hero";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { FeaturedOffers } from "@/components/home/featured-offers";
import { StatsStrip } from "@/components/home/stats-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { Experiences } from "@/components/home/experiences";
import { TrustSection } from "@/components/home/trust-section";
import { Testimonials } from "@/components/home/testimonials";
import { TravelInspiration } from "@/components/home/travel-inspiration";
import { OperatorsCta } from "@/components/home/operators-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersStrip />
      <PopularDestinations />
      <FeaturedOffers />
      <StatsStrip />
      <HowItWorks />
      <Experiences />
      <TrustSection />
      <Testimonials />
      <TravelInspiration />
      <OperatorsCta />
    </>
  );
}
