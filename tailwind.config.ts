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
      // --- SERVELY PREMIUM PALETTE ---
      colors: {
        'brand-background': '#FAFAFA',  
        'brand-surface': '#FFFFFF',     
        'brand-dark': '#0A0A0A',     
        'brand-muted': '#737373', 
        'brand-accent': '#991B1B',    
        'brand-border': '#F5F5F5',      
      },
      fontFamily: {
        // Next.js Google Fonts entegrasyonu
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      transitionTimingFunction: {
        'premium-ease': 'cubic-bezier(0.22, 1, 0.36, 1)', 
      },
      keyframes: {
        // Sektörden bağımsız, daha profesyonel animasyon isimleri
        'gentle-zoom': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'soft-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'hero-zoom': 'gentle-zoom 10s ease-in-out infinite',
        'float': 'soft-float 5s ease-in-out infinite',
        'fade-up': 'fade-in-up 0.8s premium-ease forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Artık native olduğu için line-clamp pluginine gerek yok (Tailwind 3.3+)
  ],
};

export default config;