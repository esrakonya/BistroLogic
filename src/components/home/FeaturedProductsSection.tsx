// Dosya Yolu: /src/components/home/FeaturedProductsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/menu/ProductCard';
import type { CleanProduct } from '@/lib/types';
import { SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function FeaturedProductsSection() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
  });

  const [products, setProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/featured-products?v=${new Date().getTime()}`);
        if (!res.ok) throw new Error("Connection lost");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("[Featured API Error]:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
           <div className="h-10 w-48 bg-neutral-100 rounded-full animate-pulse mb-4 mx-auto" />
           <div className="h-6 w-96 bg-neutral-50 rounded-full animate-pulse mb-12 mx-auto" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-neutral-100 rounded-[2rem] animate-pulse" />)}
           </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-neutral-400">
              <SparklesIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Exclusive Selection</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-neutral-900 tracking-tight">
              The Handpicked <br/> Collection
            </h2>
            <p className="text-neutral-500 text-lg font-light leading-relaxed">
              Explore our most celebrated culinary creations, curated by our chefs for a memorable dining journey.
            </p>
          </div>
          
          <Link href="/menu" className="group flex items-center gap-2 text-neutral-900 font-bold uppercase tracking-widest text-xs border-b-2 border-neutral-900 pb-2 transition-all hover:gap-4">
            View Full Menu
            <ChevronRightIcon className="h-4 w-4 stroke-2" />
          </Link>
        </header>
        
        {/* --- CAROUSEL --- */}
        <div className="relative">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex -ml-8">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-8">
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ProductCard
                      product={product}
                      onCardClick={() => {}} // Ana sayfada sadece sergiliyoruz
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Drag Hint: Kullanıcıya kaydırılabilir olduğunu hissettirir */}
          <div className="mt-12 flex justify-center lg:hidden">
             <div className="flex items-center gap-2 text-neutral-300">
                <div className="w-10 h-[1px] bg-neutral-200"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Swipe to Explore</span>
                <div className="w-10 h-[1px] bg-neutral-200"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}