// Dosya Yolu: /src/components/menu/CategoryButton.tsx
'use client';

import { motion } from 'framer-motion';

// Bu bileşenin kabul edeceği prop'ların tarifi
interface CategoryButtonProps {
  label: string; // Butonun içinde ne yazacak? "Tümü", "Pide", vb.
  isSelected: boolean; // Bu buton şu anda seçili mi?
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Tıklanınca ne olacak?
}

export default function CategoryButton({ label, isSelected, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      // Stil kodları artık burada merkezi olarak yönetiliyor.
      className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-background
        ${!isSelected ? 'bg-white/60 hover:bg-white/90' : ''}
      `}
    >
      {/* Animasyonlu kırmızı arka plan */}
      {isSelected && (
        <motion.div
          layoutId="active-category-pill"
          className="absolute inset-0 bg-brand-red rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
      
      {/* Buton yazısı */}
      <span className={`relative z-10 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-brand-dark'}`}>
        {label}
      </span>
    </button>
  );
}