import { Hero } from "@/components/home/hero";
import { EmergencyAction } from "@/components/home/emergency-action";
import { HowItWorks } from "@/components/home/how-it-works";
import { CoordinationTypes } from "@/components/home/coordination-types";
import { RequestsPreview } from "@/components/home/requests-preview";
import { WhyUs } from "@/components/home/why-us";
import { TrustSafety } from "@/components/home/trust-safety";
import { Testimonials } from "@/components/home/testimonials";
import { FaqPreview } from "@/components/home/faq-preview";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <EmergencyAction />
      <HowItWorks />
      <CoordinationTypes />
      <RequestsPreview />
      <WhyUs />
      <TrustSafety />
      <Testimonials />
      <FaqPreview />
      <FinalCta />
    </div>
  );
}
