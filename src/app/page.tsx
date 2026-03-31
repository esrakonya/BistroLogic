// Dosya Yolu: src/app/page.tsx
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import HeroSection from "@/components/home/HomeHero"; 

/**
 * HomePage Component
 * 
 * This is the entry point of the Servely platform. 
 * It assembles high-level sections to build a cohesive landing experience.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 
        HERO SECTION: 
        The first interaction point for users. 
        Showcases the dynamic slider and brand vision.
      */}
      <HeroSection />

      {/* 
        FEATURED PRODUCTS: 
        Displays the "Handpicked" selection from the admin panel.
        Dynamically fetched via API.
      */}
      <FeaturedProductsSection />

      {/* 
        FUTURE EXTENSIONS:
        You can easily inject new sections here such as:
        <TestimonialsSection />
        <BookingCtaSection />
      */}
    </main>
  );
}