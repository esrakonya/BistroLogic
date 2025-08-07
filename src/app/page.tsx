// Dosya Yolu: src/app/page.tsx (Nihai Hali)

// Artık direkt olarak 'Link' bileşenine ihtiyacımız yok, çünkü o slider'ın içine taşındı.
// Sadece yeni ana bileşenimizi import ediyoruz.

import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import PideEfsanesiHero from "@/components/home/HomeHero";

// Anasayfayı oluşturan diğer bölümleri istersen ileride buraya ekleyebilirsin.
// Örnek: import AboutSection from "@/components/home/AboutSection";

export default function HomePage() {
  return (
    // <>...</> React Fragment'ı içinde, anasayfamız artık sadece tek bir bileşenden oluşuyor.
    // Bu, kodumuzu inanılmaz derecede temiz ve yönetilebilir hale getiriyor.
    <>
      {/* 
        Eski statik <section> bloğunun ve <FeaturedSlider />'ın tamamını sildik.
        Çünkü onların tüm görevi, artık bu tek bileşen tarafından yapılıyor.
      */}
     <PideEfsanesiHero />
      {/* 
        Eğer ileride anasayfanın altına "Hakkımızda" veya "İletişim" gibi
        başka bölümler eklemek istersen, onları bu satırın altına ekleyeceksin.
        Örneğin:
        <AboutSection /> 
      */}
      <FeaturedProductsSection />
    </>
  );
}