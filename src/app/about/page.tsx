// Dosya Yolu: src/app/hakkimizda/page.tsx

import { getSiteContent } from "@/lib/data"; // Merkezi veri çekme fonksiyonumuzu import ediyoruz
import Image from "next/image"; // Resim eklemek için

export default async function HakkimizdaPage() {
  // Sunucu tarafında, sayfa render edilmeden önce içeriği çekiyoruz
  const allContent = await getSiteContent();
  const aboutText = allContent.find(c => c.key === 'about_us_text')?.value;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="relative h-64 w-full">
        {/* Sayfaya görsel bir zenginlik katmak için bir "banner" resmi ekleyelim */}
        <Image
          src="/images/pide-background.jpg" // Bu resmi public/images klasörüne ekleyeceğiz
          alt="Pide"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-poppins font-bold text-white tracking-wider">
            Bizim Hikayemiz
          </h1>
        </div>
      </div>
      <div className="p-8 md:p-12">
        {/* 
          @tailwindcss/typography eklentisinin 'prose' sınıfını kullanıyoruz.
          Bu sınıf, uzun metin bloklarına (paragraflar, başlıklar, listeler)
          otomatik olarak güzel bir stil, boşluk ve okunaklılık kazandırır.
        */}
        <article className="prose lg:prose-xl max-w-none text-gray-700">
          <p>
            {aboutText || "Lezzet dolu hikayemiz çok yakında burada olacak..."}
          </p>
          {/* Admin panelinden daha fazla alan ekleyerek burayı zenginleştirebiliriz */}
        </article>
      </div>
    </div>
  );
}