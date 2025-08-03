import Link from 'next/link';
// YENİ: Merkezi tip tanımını `data.ts` dosyasından import ediyoruz.
// `import type` kullanımı, bunun sadece bir tip olduğunu ve derleme sırasında
// JavaScript kodundan tamamen kaldırılabileceğini belirtir. Bu en iyi pratiktir.
import type { SiteContent } from '@/lib/data';

// ARTIK BU YEREL TANIMA İHTİYAÇ YOK. SİLİNMELİ.
/*
interface SiteContent {
  site_title?: string;
  footer_about?: string;
  footer_contact_address?: string;
  footer_contact_phone?: string;
  footer_contact_email?: string;
}
*/

interface FooterProps {
  // Artık Footer, projenin her yerinde aynı olan `SiteContent` tipini bekliyor.
  content: SiteContent | null;
}

export default function Footer({ content }: FooterProps) {
  const siteTitle = content?.site_title || "Pide Efsanesi";
  const aboutText = content?.footer_about || "Lezzetin ve geleneğin buluşma noktası.";
  const address = content?.footer_contact_address || "Adres bilgisi yakında eklenecektir.";
  const phone = content?.footer_contact_phone || "";
  const email = content?.footer_contact_email || "";

  return (
    <footer className="bg-brand-dark text-white font-sans">
      {/* Footer'ın geri kalan içeriği aynı... */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif italic font-bold mb-4">{siteTitle}</h3>
            <p className="text-brand-muted max-w-xs mx-auto md:mx-0">{aboutText}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold tracking-wider uppercase mb-4">Menü</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-brand-red transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/menu" className="hover:text-brand-red transition-colors">Lezzet Menümüz</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-brand-red transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-brand-red transition-colors">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold tracking-wider uppercase mb-4">Bize Ulaşın</h4>
            <address className="not-italic space-y-2 text-brand-muted">
              <p>{address}</p>
              {phone && <p><strong>Telefon:</strong> {phone}</p>}
              {email && <p><strong>Email:</strong> {email}</p>}
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-brand-muted">
          <p>© {new Date().getFullYear()} {siteTitle}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}