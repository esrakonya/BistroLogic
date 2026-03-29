import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Gövde metinleri için Poppins.
const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
});

// Başlıklar için, özellikle italik stilini kullanacağımız Playfair Display.
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-playfair',
  style: ['normal', 'italic'] // İtalik stilini de yüklüyoruz.
});

// Sitemizin tarayıcı sekmesinde ve arama sonuçlarında görünecek bilgilerini güncelliyoruz
export const metadata: Metadata = {
  title: "Pide Efsanesi",
  description: "Şehrin en lezzetli pideleri!",
};

// Bu, tüm sayfaları saran ana şablon bileşenidir
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dil etiketini 'en' (İngilizce) yerine 'tr' (Türkçe) olarak değiştiriyoruz
    // Tarayıcı eklentilerinden kaynaklanan hataları önlemek için suppressHydrationWarning ekliyoruz
    <html lang="tr" suppressHydrationWarning>
      
      {/* 
        <body> etiketini tamamen yeniden yapılandırıyoruz:
        - Font değişkenlerini ve varsayılan fontu (font-lato) atıyoruz.
        - `tailwind.config.js` dosyasında tanımladığımız özel arka plan (bg-brand-cream) ve metin (text-brand-dark) renklerini atıyoruz.
        - "flex flex-col min-h-screen" sınıfları ile Footer'ın her zaman sayfanın en dibinde kalmasını sağlıyoruz (yapışkan footer).
      */}
      <body className={`${poppins.variable} ${playfair.variable} font-lato bg-brand-cream text-brand-dark flex flex-col min-h-screen`}>
        
        {/* Navbar bileşenimizi sayfanın en üstüne yerleştiriyoruz */}
        <Navbar />

        {/* 
          Her bir sayfanın kendi içeriği ("children") bu <main> etiketinin içinde gösterilecek.
          "flex-grow" sınıfı, main alanının Navbar ve Footer arasındaki tüm boşluğu doldurmasını sağlar.
          "container mx-auto px-4 py-8" ile içeriği ortalar ve kenarlardan boşluk bırakırız.
        */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer bileşenimizi sayfanın en altına yerleştiriyoruz */}
        <Footer /> 

      </body>
    </html>
  );
}