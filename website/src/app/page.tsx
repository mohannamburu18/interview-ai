import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { InteractiveOverlayDemo } from "@/components/InteractiveOverlayDemo";
import { PricingComparisonSection } from "@/components/PricingComparisonSection";
import { TechStackSection } from "@/components/TechStackSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { DownloadSection } from "@/components/DownloadSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00ff88] selection:text-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InteractiveOverlayDemo />
      <PricingComparisonSection />
      <TechStackSection />
      <TestimonialsSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
