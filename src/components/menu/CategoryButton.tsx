// Dosya Yolu: /src/components/menu/CategoryButton.tsx
'use client';

import { motion } from 'framer-motion';

interface CategoryButtonProps {
  label: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * CategoryButton Component
 * 
 * Featuring a shared layout animation using framer-motion for 
 * seamless transitions between active states.
 */
export default function CategoryButton({ label, isSelected, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      // ARIA label: Erişilebilirlik (Accessibility) için önemli bir Senior detayı
      aria-pressed={isSelected}
      className={`
        relative px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] 
        rounded-full transition-all duration-500 focus:outline-none 
        ${!isSelected 
          ? 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100' 
          : 'text-white'}
      `}
    >
      {/* 
        SHARED LAYOUT ANIMATION: 
        Bu katman, seçili kategori değiştikçe butonlar arasında 
        "akıyormuş" gibi bir geçiş efekti yaratır. 
      */}
      {isSelected && (
        <motion.div
          layoutId="active-category-pill"
          className="absolute inset-0 bg-neutral-900 rounded-full shadow-lg shadow-neutral-200"
          transition={{ 
            type: 'spring', 
            stiffness: 350, 
            damping: 30 
          }}
        />
      )}
      
      {/* BUTTON LABEL */}
      <span className="relative z-10 transition-colors duration-300">
        {label}
      </span>
    </button>
  );
}