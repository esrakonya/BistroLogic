// Dosya Yolu: src/app/page.tsx

import Link from "next/link";

// Sayfa bileşenimizin adı "Home" yerine "HomePage" olabilir, bu daha açıklayıcıdır.
export default function HomePage() {
  return (
    // <main> etiketi yerine React Fragment (<>) kullanıyoruz, çünkü ana <main> etiketi
    // zaten layout.tsx dosyasında mevcut ve tüm içeriğimizi kapsıyor.
    <>
      {/* Hero Section (Karşılama Alanı) */}
      <section 
        className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white -mt-8 -mx-4" // mt ve mx negatif margin ile layout'taki boşlukları sıfırlıyoruz.
        // Arka plan resmini ve stilini burada inline olarak belirliyoruz
        style={{
          backgroundImage: "url('/images/pide-background.jpg')", // Bu resmi birazdan public klasörüne ekleyeceğiz
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        {/* Resmin üzerine karartma efekti ekleyerek yazının okunurluğunu artırıyoruz */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* İçerik Alanı */}
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold tracking-wider leading-tight animate-fade-in-down">
            GELENEKSEL LEZZETİN <br /> <span className="text-brand-yellow">MODERN YORUMU</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
            Yılların tecrübesiyle hazırlanan, odun ateşinde pişmiş efsanevi pidelerimizle tanışın.
          </p>
          <Link 
            href="/menu"
            className="mt-8 inline-block bg-brand-red hover:bg-red-800 text-white font-bold font-poppins py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Menüyü İncele
          </Link>
        </div>
      </section>

      {/* "Sitemizin Diğer Bölümleri" Alanı */}
      <section className="py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-brand-dark">Lezzetlerimizi Keşfedin</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Menümüz, en taze malzemelerle hazırlanan zengin pide çeşitlerinden, çıtır çıtır lahmacunlara ve enfes tatlılara kadar geniş bir yelpaze sunar.
          </p>
          {/* Gelecekte buraya "En Çok Satan 3 Ürün" gibi bir bölüm eklenebilir */}
        </div>
      </section>
    </>
  );
}