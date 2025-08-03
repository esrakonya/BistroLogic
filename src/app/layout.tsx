import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/data";

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Pide Efsanesi",
  description: "Şehrin en lezzetli pideleri!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const siteContentData = await getSiteContent();
  const siteContentObject = (siteContentData && siteContentData.length > 0) ? siteContentData[0] : null;

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${playfair.variable} font-sans flex flex-col min-h-screen bg-brand-background text-brand-dark`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer content={siteContentObject} />
      </body>
    </html>
  );
}