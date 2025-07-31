// Dosya Yolu: src/components/Footer.tsx

import Link from 'next/link';
import { getSiteContent } from '@/lib/data'; // Yeni veri çekme fonksiyonumuzu import ediyoruz.

// Bileşeni 'async' olarak işaretliyoruz.
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Sunucu tarafında, bileşen render edilmeden önce veriyi çekiyoruz.
  const allContent = await getSiteContent();

  // Veriyi, anahtarlarıyla kolayca erişebileceğimiz bir objeye dönüştürelim.
  const content = allContent.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);
  
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Bölüm 1: Logo ve Açıklama */}
          <div>
            <h3 className="text-white font-poppins font-bold text-xl tracking-wider">
              EFSANE<span className="text-brand-yellow">PİDE</span>
            </h3>
            <p className="mt-4 text-gray-400 text-sm">
              Geleneksel tatları modern sunumla birleştiriyoruz. Şehrin en iyi pidecisi.
            </p>
          </div>

          {/* Bölüm 2: Hızlı Linkler */}
          <div>
            <h4 className="font-poppins font-semibold tracking-wider uppercase">Hızlı Menü</h4>
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/" className="text-gray-300 hover:text-brand-yellow transition-colors duration-300">Ana Sayfa</Link>
              <Link href="/menu" className="text-gray-300 hover:text-brand-yellow transition-colors duration-300">Menü</Link>
              <Link href="/about" className="text-gray-300 hover:text-brand-yellow transition-colors duration-300">Hakkımızda</Link>
              <Link href="/contact" className="text-gray-300 hover:text-brand-yellow transition-colors duration-300">İletişim</Link>
            </div>
          </div>

          {/* Bölüm 3: İletişim (ARTIK DİNAMİK) */}
          <div>
            <h4 className="font-poppins font-semibold tracking-wider uppercase">Bize Ulaşın</h4>
            <div className="mt-4 flex flex-col space-y-2 text-gray-300">
              {/* Statik metinler yerine, veritabanından gelen 'content' objesini kullanıyoruz. */}
              <p>{content.address_text || 'Adres bilgisi girilmemiş.'}</p>
              <p>{content.phone_number || 'Telefon bilgisi girilmemiş.'}</p>
              {/* Çalışma saatlerini de ekleyebiliriz */}
              <p className="mt-2">{content.working_days || ''}</p>
              <p>{content.working_hours || ''}</p>
            </div>
          </div>

        </div>

        {/* Alt Bölüm: Telif Hakkı */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>© {currentYear} Efsane Pide. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

// Footer bileşeninde "export default async function" kullanıldığı için,
// "export default Footer;" satırına artık gerek yoktur.