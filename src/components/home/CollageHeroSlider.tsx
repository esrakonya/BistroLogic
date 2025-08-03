// Dosya Yolu: /src/components/home/CollageHeroSlider.tsx (Birleşme Efektli Versiyon)
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// --- VERİ YAPISI ---
// Her resmin nereden geleceğini ve son konumunu tanımlıyoruz.
const slidesData = [
  {
    id: 1,
    productName: 'Kuşbaşılı Pide',
    heroTitle: 'EFSANEVİ LEZZET',
    // Her resim için başlangıç (initial) ve bitiş (animate) pozisyonları.
    images: [
      // Parça 1: Kuşbaşı Et
      { src: '/images/beef.png', initial: { x: '100vw', y: '10vh' }, animate: { x: '65vw', y: '10vh' }, className: 'w-1/4 h-1/3 rounded-lg shadow-lg' },
      // Parça 2: Domates
      { src: '/images/tomatoes.png', initial: { x: '-100vw', y: '40vh' }, animate: { x: '10vw', y: '40vh' }, className: 'w-1/5 h-1/4 rounded-lg shadow-lg' },
      // Ana Resim: Pide (En son gelecek)
      { src: '/images/kusbasipide.jpg', initial: { opacity: 0, scale: 1.2 }, animate: { opacity: 1, scale: 1 }, className: 'object-cover', isBackground: true },
    ]
  },
  {
    id: 2,
    productName: 'Kaşarlı Pide',
    heroTitle: 'VAZGEÇİLMEZ KLASİK',
    images: [
      // Parça 1: Peynir
      { src: '/images/detail-peynir.jpg', initial: { y: '-100vh' }, animate: { y: '15vh' }, className: 'w-1/3 h-1/4 left-[33%] rounded-lg shadow-lg' },
      // Ana Resim: Pide
      { src: '/images/pide-background-2.jpg', initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'object-cover', isBackground: true },
    ]
  },
];

export default function CollageHeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const activeSlide = slidesData[activeIndex];

  return (
    <section className="relative h-[70vh] min-h-[500px] text-white overflow-hidden -mt-8 -mx-4 bg-brand-dark">
      {/* 1. ANİMASYON SAHNESİ */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {/* Her slayt geçişinde, eski sahne kaybolur, yeni sahne gelir */}
          <motion.div key={activeIndex} className="absolute inset-0">
            {activeSlide.images.map((image, index) => (
              <motion.div
                key={index}
                className={`absolute ${image.className}`}
                // Başlangıç ve bitiş pozisyonlarını veri yapısından alıyoruz
                initial={image.initial}
                // Animasyon, bir öncekinden sonra başlasın diye gecikme (delay) ekliyoruz
                animate={{ ...image.animate, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.4 } }}
              >
                <Image
                  src={image.src}
                  alt={`${activeSlide.productName} detayı`}
                  fill
                  // Ana arka plan resmini arkaya, diğerlerini öne alıyoruz
                  className={image.isBackground ? 'z-0' : 'z-10 object-cover'}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Karartma efekti ve Sürükleme Motoru */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>
      <div className="absolute inset-0 z-30" ref={emblaRef}><div className="flex h-full">{slidesData.map(s => <div key={s.id} className="flex-shrink-0 basis-full h-full" />)}</div></div>
      
      {/* 2. METİN İÇERİĞİ */}
      {/* Metinlerin, tüm resim animasyonları bittikten sonra gelmesi için gecikme ekliyoruz */}
      <motion.div
        key={activeIndex} // Bu da slaytla birlikte yeniden animasyon yapar
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: (activeSlide.images.length * 0.4) + 0.2 } }}
        className="relative z-40 flex flex-col items-center justify-center h-full text-center p-4"
      >
        <p className="text-lg font-semibold tracking-widest text-brand-red uppercase">{activeSlide.productName}</p>
        <h1 className="text-4xl md:text-6xl font-poppins font-bold leading-tight mt-2">{activeSlide.heroTitle}</h1>
        <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
          Menüyü İncele
        </Link>
      </motion.div>
      
      {/* Navigasyon Noktaları */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}