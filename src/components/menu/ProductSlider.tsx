// Dosya Yolu: /src/components/menu/ProductSlider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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

/**
 * ProductSlider Component
 * 
 * An optimized carousel for showcasing products with 
 * smooth Embla transitions and Servely branding.
 */
export default function ProductSlider({ products, onProductClick }: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true // Daha doğal bir kaydırma hissi için
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  if (products.length === 0) return null;

  return (
    <div className="group relative px-4">
      
      {/* --- CAROUSEL VIEWPOT --- */}
      <div className="overflow-visible" ref={emblaRef}>
        <div className="flex -ml-6 md:-ml-10">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 flex-grow-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 pl-6 md:pl-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard
                  product={product}
                  onCardClick={() => onProductClick(product)}
                />
              </motion.div>
            </div>
          ))}
          
          {/* Last Slide: View More Hint */}
          <div className="flex-shrink-0 flex-grow-0 basis-[40%] sm:basis-1/4 flex items-center justify-center pl-10">
            <Link href="/menu" className="group flex flex-col items-center gap-4 text-neutral-300 hover:text-neutral-900 transition-all">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-200 flex items-center justify-center group-hover:border-neutral-900 group-hover:scale-110 transition-all">
                    <ArrowRightIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">View All</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION CONTROLS --- */}
      {/* Previous Button */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={`
          absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 md:-translate-x-6
          z-30 p-4 rounded-full bg-white shadow-2xl border border-neutral-100
          transition-all duration-300 active:scale-90
          ${prevBtnEnabled ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}
        `}
        aria-label="Previous"
      >
        <ChevronLeftIcon className="h-5 w-5 text-neutral-900 stroke-[2.5px]" />
      </button>

      {/* Next Button */}
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={`
          absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 md:translate-x-6
          z-30 p-4 rounded-full bg-white shadow-2xl border border-neutral-100
          transition-all duration-300 active:scale-90
          ${nextBtnEnabled ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}
        `}
        aria-label="Next"
      >
        <ChevronRightIcon className="h-5 w-5 text-neutral-900 stroke-[2.5px]" />
      </button>

      {/* Scroll Progress Bar (Senior UX Detail) */}
      <div className="mt-12 h-[2px] w-full bg-neutral-100 rounded-full overflow-hidden hidden md:block">
          <motion.div 
            className="h-full bg-neutral-900"
            animate={{ 
                width: `${((products.indexOf(products[emblaApi?.selectedScrollSnap() || 0]) + 1) / products.length) * 100}%` 
            }}
          />
      </div>
    </div>
  );
}