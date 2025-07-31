// Dosya Yolu: src/app/iletisim/page.tsx

import { getSiteContent } from "@/lib/data";
import { PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

export default async function IletisimPage() {
  const allContent = await getSiteContent();
  
  // Veriyi, anahtarlarıyla kolayca erişebileceğimiz bir objeye dönüştürüyoruz
  const content = allContent.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-brand-dark">
          Bize Ulaşın
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Soru, öneri veya toplu siparişleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz. Sizleri dükkanımızda ağırlamaktan mutluluk duyarız!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-8 rounded-lg shadow-xl">
        {/* Sol Taraf: İletişim Bilgileri */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="flex items-start">
            <MapPinIcon className="h-10 w-10 text-brand-red flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="text-xl font-poppins font-semibold text-brand-dark">Adresimiz</h3>
              <p className="text-gray-700 mt-1">{content.address_text || "Adres bilgisi girilmemiş."}</p>
            </div>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="h-10 w-10 text-brand-red flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="text-xl font-poppins font-semibold text-brand-dark">Telefon</h3>
              {/* Telefon numarasını mobil cihazlarda tıklanabilir (aranabilir) hale getiriyoruz */}
              <a 
                href={`tel:${content.phone_number?.replace(/\s/g, '')}`} 
                className="text-gray-700 hover:text-brand-red transition-colors duration-300 mt-1 block"
              >
                {content.phone_number || "Telefon bilgisi girilmemiş."}
              </a>
            </div>
          </div>
          <div className="flex items-start">
            <ClockIcon className="h-10 w-10 text-brand-red flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="text-xl font-poppins font-semibold text-brand-dark">Çalışma Saatleri</h3>
              <p className="text-gray-700 mt-1">{content.working_days || ""}, {content.working_hours || ""}</p>
              <p className="text-gray-700">{content.closed_day_note || ""}</p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Google Harita */}
        <div className="w-full h-80 lg:h-full rounded-lg overflow-hidden shadow-md">
          {content.map_embed_code ? (
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: content.map_embed_code }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Harita bilgisi yakında eklenecek.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}