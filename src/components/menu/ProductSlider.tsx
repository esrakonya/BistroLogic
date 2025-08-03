// Dosya Yolu: /src/components/menu/ProductSlider.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Tiplerimizi buraya da taşıyalım
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}
interface ProductSliderProps {
  products: Product[];
  onProductClick: (product: any) => void;
}

export default function ProductSlider({ products, onProductClick }: ProductSliderProps) {
  // Embla hook'unu kullanarak slider referansını ve API'ını alıyoruz.
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, // Sonsuz döngü istemiyoruz
    align: 'start', // Kartları başlangıca hizala
    containScroll: 'trimSnaps' // Fazla kaydırmayı engelle
  });

  // Butonların aktif/pasif durumunu kontrol etmek için state'ler
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Slider'ın durumu değiştiğinde butonların durumunu güncelleyen fonksiyon
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // emblaApi hazır olduğunda 'select' olayını dinlemeye başla
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect); // Yeniden boyutlandırmada da kontrol et
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  // Eğer hiç ürün yoksa, bu bileşeni render etme
  if (products.length === 0) return null;

  return (
    <div className="relative">
      {/* 1. SLIDER KAPSAYICISI */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* 2. KARTLARIN OLDUĞU ALAN */}
        {/* Embla, bu div'in içindeki flex item'ları kaydıracak */}
        <div className="flex -ml-4">
          {products.map((product) => (
            // Her kartın flex-basis'ini ayarlayarak kaç tane görüneceğini belirliyoruz.
            // 'pl-4' ile aralarındaki boşluğu sağlıyoruz.
            <div key={product.id} className="flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4">
              <ProductCard
                product={product}
                onCardClick={() => onProductClick(product)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. NAVİGASYON BUTONLARI */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Önceki Ürünler"
      >
        <ChevronLeftIcon className="h-6 w-6 text-brand-dark" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md transition-opacity hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Sonraki Ürünler"
      >
        <ChevronRightIcon className="h-6 w-6 text-brand-dark" />
      </button>
    </div>
  );
}