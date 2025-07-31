// Dosya Yolu: src/app/layout.tsx

// Gerekli Next.js ve React tiplerini import ediyoruz
import type { Metadata } from "next";

// Varsayılan 'Inter' fontu yerine, kendi seçtiğimiz 'Poppins' ve 'Lato' fontlarını import ediyoruz
import { Poppins, Lato } from 'next/font/google';

// Projemizin ana CSS dosyasını (Tailwind direktiflerini içeren) import ediyoruz
import "./globals.css";

// Kendi oluşturduğumuz Navbar ve Footer bileşenlerini import ediyoruz
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Poppins fontunu, başlıklar için kullanmak üzere yapılandırıyoruz
const poppins = Poppins({
  subsets: ['latin'], // Karakter seti
  weight: ['400', '600', '700'], // İhtiyacımız olan yazı kalınlıkları
  variable: '--font-poppins', // CSS'te bu isimle bir değişken oluşturacak
});

// Lato fontunu, genel metinler için kullanmak üzere yapılandırıyoruz
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
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
      <body className={`${poppins.variable} ${lato.variable} font-lato bg-brand-cream text-brand-dark flex flex-col min-h-screen`}>
        
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