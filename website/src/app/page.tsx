import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { InteractiveOverlayDemo } from "@/components/InteractiveOverlayDemo";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PricingComparisonSection } from "@/components/PricingComparisonSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { DownloadSection } from "@/components/DownloadSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white selection:bg-brand-500 selection:text-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <InteractiveOverlayDemo />
      <HowItWorksSection />
      <PricingComparisonSection />
      <TestimonialsSection />
      <FAQSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
