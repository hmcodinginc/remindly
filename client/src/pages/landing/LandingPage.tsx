import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/use-auth-store"
import { HeroSection } from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { PricingSection } from "./components/PricingSection"
import { FAQSection } from "./components/FAQSection"
import { FooterSection } from "./components/FooterSection"

export function LandingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const isElectron =
      typeof window !== "undefined" &&
      window.navigator.userAgent.toLowerCase().includes("electron")
    if (isElectron) {
      if (user) {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
    }
  }, [user, navigate])

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
