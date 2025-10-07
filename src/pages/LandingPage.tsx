import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SponsorsSection } from "@/components/sections/sponsors-section";
import { Footer } from "@/components/ui/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SponsorsSection />
      </main>
      <Footer />
    </div>
  );
}