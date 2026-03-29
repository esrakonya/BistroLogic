// Dosya Yolu: /src/components/Footer.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'; // Facebook ve Twitter ikonları, linkler eklenirse diye kalabilir.

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
    <Icon className="h-6 w-6" />
  </a>
);

const getContentValue = (contents: any[], key: string) => {
  return contents?.find(c => c.key === key)?.value || '';
};

export default async function Footer() {
  const supabase = createServerComponentClient({ cookies });

  const { data: contents, error } = await supabase.from('site_content').select('key, value');
  
  if (error) {
    console.error("Footer için site içeriği çekilemedi:", error);
    return <footer className="bg-brand-dark text-white p-4 text-center">Footer yüklenemedi.</footer>;
  }
  
  const safeContents = contents || [];
  
  // DEĞİŞİKLİK: Değişken adlarını ve key'leri sizin veritabanınızdakiyle eşleştirdim.
  const slogan = getContentValue(safeContents, 'footer_slogan');
  const phoneNumber = getContentValue(safeContents, 'phone_number');
  const address = getContentValue(safeContents, 'address_text');
  const instagramUrl = getContentValue(safeContents, 'social_instagram');
  // Facebook ve Twitter sizde olmadığı için, bu değişkenler boş dönecek ve ikonlar görünmeyecek.
  const facebookUrl = getContentValue(safeContents, 'social_facebook');
  const twitterUrl = getContentValue(safeContents, 'social_twitter');
  
  return (
    <footer className="bg-brand-dark text-white font-sans py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          
          {/* Sütun 1: Logo ve Slogan */}
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="text-white font-poppins font-bold text-2xl tracking-wider">
              EFSANE<span className="text-brand-yellow">PİDE</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">{slogan}</p>
          </div>

          {/* Sütun 2: Hızlı Menü */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-gray-300">Hızlı Menü</h3>
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Ana Sayfa</Link>
              <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menü</Link>
              {/* <Link href="/about" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link> */}
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">İletişim</Link>
            </div>
          </div>

          {/* Sütun 3: İletişim Bilgileri */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-gray-300">İletişim</h3>
            <div className="mt-4 flex flex-col space-y-2 text-gray-400">
              {/* DEĞİŞİKLİK: 'phoneNumber' ve 'address' değişkenleri kullanılıyor */}
              {phoneNumber && <a href={`tel:${phoneNumber}`} className="hover:text-white">{phoneNumber}</a>}
              {address && <p>{address}</p>}
            </div>
          </div>
          
          {/* Sütun 4: Sosyal Medya */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-gray-300">Bizi Takip Edin</h3>
            <div className="mt-4 flex justify-center sm:justify-start space-x-5">
              {/* DEĞİŞİKLİK: Sadece 'instagramUrl' kullanılıyor */}
              {instagramUrl && <SocialLink href={instagramUrl} icon={FaInstagram} />}
              {/* Facebook ve Twitter URL'leri boş döneceği için bu linkler render edilmeyecek */}
              {facebookUrl && <SocialLink href={facebookUrl} icon={FaFacebook} />}
              {twitterUrl && <SocialLink href={twitterUrl} icon={FaTwitter} />}
            </div>
          </div>

        </div>

        {/* Telif Hakkı Kısmı */}
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pide Efsanesi. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}