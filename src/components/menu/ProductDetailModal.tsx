// Dosya Yolu: src/components/menu/ProductDetailModal.tsx

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Tipler ve Props tanımlamaları aynı...
interface Ingredient { name: string; }
interface Product { id: number; name: string; description: string | null; price: number; image_url: string | null; ingredients: Ingredient[]; categoryName: string; }
interface ProductDetailModalProps { isOpen: boolean; product: Product | null; onClose: () => void; }

export default function ProductDetailModal({ isOpen, product, onClose }: ProductDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* 1. ARKA PLAN PERDESİ: Yumuşakça belirir */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* 2. ANA İÇERİK: Büyüyerek ve konum değiştirerek gelir */}
          <motion.div
            // Bu `layoutId`, ProductCard'daki resimle bağlantı kurar. (Sonraki adımda ekleyeceğiz)
            layoutId={`card-container-${product.id}`}
            className="fixed inset-0 z-50 m-auto h-full max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-brand-surface shadow-2xl"
          >
            {/* Scroll edilebilir içerik alanı */}
            <div className="h-full overflow-y-auto">
              {/* Fotoğraf Alanı */}
              <motion.div layoutId={`card-image-${product.id}`} className="relative h-96 w-full">
                <Image
                  src={product.image_url || ''}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bilgi Alanı */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                className="p-8 md:p-10"
              >
                <p className="font-sans text-sm font-semibold text-brand-red uppercase tracking-wider">{product.categoryName}</p>
                <h3 className="font-serif text-5xl font-bold italic leading-tight text-brand-dark mt-2">
                  {product.name}
                </h3>
                <p className="mt-6 font-sans text-base text-brand-muted">
                  {product.description}
                </p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-sans text-lg font-medium text-brand-dark mb-3">İçindekiler</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing, i) => (
                        <span key={i} className="bg-gray-100 text-brand-dark text-sm font-medium px-3 py-1.5 rounded-full">{ing.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-10 pt-6 border-t border-brand-border">
                    <p className="font-serif text-6xl font-bold text-brand-red">
                      {product.price.toFixed(2)} TL
                    </p>
                </div>
              </motion.div>
            </div>
            
            {/* Kapatma Butonu */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 focus:outline-none transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}