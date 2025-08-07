// Dosya Yolu: /src/components/Footer.tsx
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'; // Sosyal medya ikonları için

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
    <Icon className="h-6 w-6" />
  </a>
);

export default function Footer() {
  return (
    // DEĞİŞİKLİK 1: Ana Dikey Boşluk Azaltıldı
    // Eskiden py-16 md:py-20 gibi yüksek bir değer olabilirdi.
    // Şimdi mobil için py-10 (40px), web için md:py-14 (56px) olarak daha kompakt hale getirildi.
    <footer className="bg-brand-dark text-white font-sans py-5 md:py-14">
      <div className="container mx-auto px-4">
        
        {/* Üst Kısım: Logo, Linkler ve Sosyal Medya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Sol Sütun: Logo ve Slogan */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-white font-poppins font-bold text-2xl tracking-wider">
              EFSANE<span className="text-brand-yellow">PİDE</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              Geleneksel lezzet, modern sunum. Odun ateşinden sofranıza.
            </p>
          </div>

          {/* Orta Sütun: Hızlı Menü */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-gray-300">Hızlı Menü</h3>
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Ana Sayfa</Link>
              <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menü</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">İletişim</Link>
            </div>
          </div>
          
          {/* Sağ Sütun: Sosyal Medya */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-gray-300">Bizi Takip Edin</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-5">
              <SocialLink href="https://instagram.com" icon={FaInstagram} />
              <SocialLink href="https://facebook.com" icon={FaFacebook} />
              <SocialLink href="https://twitter.com" icon={FaTwitter} />
            </div>
          </div>

        </div>

        {/* Alt Kısım: Telif Hakkı */}
        {/* DEĞİŞİKLİK 2: İçerik ve Alt Kısım Arası Boşluk Azaltıldı */}
        {/* Eskiden mt-16 gibi bir değer olabilirdi. Şimdi mt-10 (40px) olarak ayarlandı. */}
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pide Efsanesi. Tüm Hakları Saklıdır.</p>
        </div>

      </div>
    </footer>
  );
}