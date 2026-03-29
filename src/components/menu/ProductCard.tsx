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
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  return (
    // Dış sarmalayıcı (Titremeyi önlemek için)
    <motion.div layoutId={`card-container-${product.id}`}
      onClick={onCardClick}
      className="group h-full cursor-pointer focus:outline-none"
    >
      {/* --- NİHAİ GÜNCELLEME: Çizgi sorununu çözmek için --- */}
      {/* 
        'transform-gpu' ve 'backface-hidden' sınıfları eklendi.
        1. 'transform-gpu': Tarayıcıyı tam donanım hızlandırmaya (hardware acceleration) zorlar.
           Bu, 'translateZ(0)' hilesini uygulayarak render motorunu stabil hale getirir ve çizim hatalarını önler.
        2. 'backface-hidden': 3D dönüşüm sırasında elemanın "arkasının" görünmesini engelleyerek ekstra güvenlik sağlar.
      */}
      <div 
        className="flex h-full flex-col overflow-hidden rounded-lg bg-brand-surface shadow-sm transition-all duration-300 ease-custom-ease border border-brand-border group-hover:-translate-y-2 group-hover:shadow-xl backface-hidden transform-gpu"
      >
      {/* --- GÜNCELLEME SONU --- */}

        {/* Çerçeve Efekti */}
        <div className="absolute inset-0 z-10 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-brand-red" />
        
        {/* Resim Alanı */}
        <motion.div layoutId={`card-image-${product.id}`}className="relative h-60 w-full overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw, 33vw"
              className="
                object-cover
                transition-transform duration-500 ease-custom-ease
                scale-75
                group-hover:scale-105
                backface-hidden transform-gpu
              "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="font-sans text-brand-muted">Fotoğraf Yok</p>
            </div>
          )}
        </motion.div>

        {/* İçerik Alanı */}
        <div className="flex flex-grow flex-col p-6 text-left">
          <h3 className="font-serif text-2xl font-bold italic text-brand-dark leading-tight">
            {product.name}
          </h3>
          <p className="mt-3 text-sm text-brand-muted font-sans line-clamp-3 flex-grow">
            {product.description || 'Bu ürün için detaylı bir açıklama bulunmamaktadır.'}
          </p>
          <div className="mt-5 pt-5 border-t border-brand-border">
            <p className="font-serif text-3xl font-bold text-brand-red">
              {product.price.toFixed(2)} TL
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}