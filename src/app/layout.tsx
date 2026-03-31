// File path: src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/data"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutWrapper from "@/components/LayoutWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Font ayarları (Aynı kalıyor)
const poppins = Poppins({ subsets: ["latin"], variable: '--font-poppins', weight: ['400', '600'] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair', weight: ['400', '700'] });

/**
 * SENIOR TOUCH: Dynamic Metadata
 * Veritabanından dükkan ismini veya sloganı çekerek 
 * tarayıcı sekmesini otomatik güncelliyoruz.
 */
export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const siteName = "Servely";
  
  return {
    title: `${siteName} | Smart Restaurant Management`,
    description: "Experience the art of modern dining management with Servely.",
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Sayfa bazında içerik çekmeye gerek yok, çünkü Navbar ve Footer 
  // Next.js Server Component olduğu için kendi verilerini bağımsız çekerler.
  // Bu, Layout'un daha hızlı render edilmesini sağlar (Parallel Fetching).

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased flex flex-col min-h-screen bg-neutral-50 text-neutral-900`}>
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
        <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
      </body>
    </html>
  );
}