// Dosya Yolu: src/components/menu/ProductCard.tsx

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface ProductCardProps {
  product: Product;
  onCardClick: () => void;
  isSelected?: boolean;
}

export default function ProductCard({ product, onCardClick, isSelected = false }: ProductCardProps) {
  return (
    <motion.div layoutId={`card-container-${product.id}`}
      onClick={onCardClick}
      className="group h-full cursor-pointer focus:outline-none"
    >
      <div 
        className="flex h-full flex-col overflow-hidden rounded-lg bg-brand-surface shadow-sm transition-all duration-300 ease-custom-ease border border-brand-border group-hover:-translate-y-2 group-hover:shadow-xl backface-hidden transform-gpu"
      >
        <div className={`absolute inset-0 z-10 rounded-lg border-2 transition-colors duration-300 ${
          isSelected ? 'border-brand-red' : 'border-transparent group-hover:border-brand-red'
        }`} />
        
        <div className="relative h-48 md:h-60 w-full overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw, 33vw"
              //
              // DEĞİŞİKLİK BURADA: className'i dinamik hale getiriyoruz.
              //
              className={`
                object-cover
                transition-transform duration-500 ease-custom-ease
                backface-hidden transform-gpu
                ${
                  // EĞER KART SEÇİLİ İSE: Resmi büyüt ve orada tut.
                  isSelected 
                    ? 'scale-105' 
                    // EĞER KART SEÇİLİ DEĞİLSE: Normal hali küçük olsun, hover edince büyüsün.
                    : 'scale-75 group-hover:scale-105'
                }
              `}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <p className="font-sans text-sm text-brand-muted">Fotoğraf Yok</p>
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col p-4 md:p-6 text-left">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark leading-tight">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-brand-muted font-sans line-clamp-3 flex-grow">
            {product.description || 'Bu ürün için detaylı bir açıklama bulunmamaktadır.'}
          </p>
          <div className="mt-4 pt-4 border-t border-brand-border">
            <p className="font-serif text-xl md:text-2xl font-semibold text-brand-dark">
              {product.price.toFixed(2)} TL
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}