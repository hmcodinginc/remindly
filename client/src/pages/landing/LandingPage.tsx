import { HeroSection } from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { PricingSection } from "./components/PricingSection"
import { FAQSection } from "./components/FAQSection"
import { FooterSection } from "./components/FooterSection"

export function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </div>
  )
}
