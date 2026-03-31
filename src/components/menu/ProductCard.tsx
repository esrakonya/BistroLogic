// Dosya Yolu: src/components/menu/ProductCard.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

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

/**
 * ProductCard Component
 * 
 * Features high-fidelity layout transitions and a refined aesthetic 
 * for a boutique SaaS experience.
 */
export default function ProductCard({ product, onCardClick, isSelected = false }: ProductCardProps) {
  return (
    <motion.div 
      layoutId={`card-container-${product.id}`}
      onClick={onCardClick}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full cursor-pointer list-none"
    >
      <div 
        className={`
          flex h-full flex-col overflow-hidden rounded-[2rem] bg-white 
          border transition-all duration-500
          ${isSelected 
            ? 'border-neutral-900 shadow-2xl ring-1 ring-neutral-900' 
            : 'border-neutral-100 shadow-sm hover:shadow-xl hover:border-neutral-200'}
        `}
      >
        {/* IMAGE SECTION */}
        <div className="relative h-56 md:h-64 w-full overflow-hidden bg-neutral-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`
                object-cover transition-transform duration-700 ease-out
                ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-110'}
              `}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-neutral-300">
              <PhotoIcon className="h-10 w-10 mb-2 opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Image</span>
            </div>
          )}
          
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        {/* CONTENT SECTION */}
        <div className="flex flex-grow flex-col p-6 md:p-8">
          <div className="flex justify-between items-start mb-3">
             <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-900 leading-tight">
               {product.name}
             </h3>
          </div>
          
          <p className="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed flex-grow">
            {product.description || 'Our chef’s special selection, crafted with premium seasonal ingredients for an unforgettable taste.'}
          </p>
          
          {/* PRICE TAG */}
          <div className="mt-6 pt-5 border-t border-neutral-50 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Price</span>
            <p className="font-serif text-xl md:text-2xl font-black text-neutral-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Indicator - Floating Badge */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-20 bg-neutral-900 text-white p-2 rounded-full shadow-xl border-2 border-white"
        >
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
}