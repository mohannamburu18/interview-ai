import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { InteractiveOverlayDemo } from "@/components/InteractiveOverlayDemo";
import { PlatformsSection } from "@/components/PlatformsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingComparisonSection } from "@/components/PricingComparisonSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { DownloadSection } from "@/components/DownloadSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-parakeet-500 selection:text-black">
      <Navbar />
      <HeroSection />
      <InteractiveOverlayDemo />
      <PlatformsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingComparisonSection />
      <TestimonialsSection />
      <FAQSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}

