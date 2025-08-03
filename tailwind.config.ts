// Dosya Yolu: tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- "Sofistike & Cesur" Paleti ---
      colors: {
        'brand-background': '#F9F9F9',  // Ferahlık için Çok Açık Gri Zemin
        'brand-surface': '#FFFFFF',     // Kartlar için Saf Beyaz Yüzey
        'brand-dark': '#333333',        // Koyu Antrasit (Ana Metin)
        'brand-muted': '#6B7280',       // Soluk Gri (Yardımcı Metin)
        'brand-red': '#B91C1C',         // Modern, Derin ve Sofistike Kırmızı (Vurgu)
        'brand-border': '#E5E7EB',      // İnce Çizgiler ve Sınırlar
      },
      fontFamily: {
        // layout.tsx'te tanımlanan CSS değişkenleri
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        // Fırının "nefes alması" için
        'furnace-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        // Malzemelerin hafifçe süzülmesi için
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      },
      animation: {
        'furnace-pulse': 'furnace-pulse 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;