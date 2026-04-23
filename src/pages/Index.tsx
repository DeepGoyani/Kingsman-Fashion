import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LookbookSection from "@/components/LookbookSection";
import FeaturedSection from "@/components/FeaturedSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="bg-background">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <LookbookSection />
        <FeaturedSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
