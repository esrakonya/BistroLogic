// Dosya Yolu: /src/components/home/CinematicHeroSlider.tsx (İnceleme Modu: Daha Çok, Daha Büyük, Daha Yavaş)
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const slidesData = [
  {
    id: 1,
    productName: 'Kuşbaşılı Pide',
    heroTitle: 'LEZZET KASIRGASI',
    ingredients: [
      { src: '/images/beef.png' },
      { src: '/images/cheese.png' },
      { src: '/images/green-pepper.png' },
      { src: '/images/red-pepper.png' },
      { src: '/images/tomatoes.png' },
    ],
    // --- ANA DEĞİŞİKLİK 1: ÇOK DAHA FAZLA PARÇACIK ---
    partCount: 40, // Parçacık sayısı 35'ten 40'a çıkarıldı.
  },
  {
    id: 2,
    productName: 'Kaşarlı Pide',
    heroTitle: 'ALTIN ORAN',
    ingredients: [ { src: '/images/cheese.png' }, { src: '/images/tomatoes.png' } ],
    partCount: 30,
    finalImage: { src: '/images/pide-background-2.jpg' }
  },
];

const generateFlyingParts = (ingredients: {src: string}[], count: number) => {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const side = Math.floor(Math.random() * 4);
    const initialPos = {
      x: side === 0 ? '-50vw' : side === 1 ? '150vw' : `${Math.random() * 100}vw`,
      y: side === 2 ? '-50vh' : side === 3 ? '150vh' : `${Math.random() * 100}vh`,
    };
    parts.push({
      src: ingredients[i % ingredients.length].src,
      id: i,
      initial: { ...initialPos, scale: Math.random() * 0.5 + 0.5, rotate: Math.random() * 360 - 180 },
      animate: {
        x: '50vw', y: '50vh', translateX: '-50%', translateY: '-50%',
        scale: 0, opacity: 0, rotate: 0,
      }
    });
  }
  return parts;
};

export default function CinematicHeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 60 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Düzeltilmiş TypeScript Hatası için finalImage'i ekliyoruz.
  const slideWithDefaults = {
      ...slidesData[activeIndex],
      finalImage: slidesData[activeIndex].finalImage || { src: '/images/pide-background.jpg' }
  };
  const activeParts = generateFlyingParts(slideWithDefaults.ingredients, slideWithDefaults.partCount);
  
  // --- ANA DEĞİŞİKLİK 2: ÇOK ÇOK YAVAŞLATILMIŞ ZAMANLAMA ---
  const TRANSFORMATION_DELAY = 7.0; // Parçaların uçuş süresi 2.6'dan 7 saniyeye çıkarıldı.
  const TOTAL_ANIMATION_TIME = TRANSFORMATION_DELAY + 1.0; 

  return (
    <section className="relative h-[70vh] min-h-[500px] text-white overflow-hidden -mt-8 -mx-4 bg-brand-dark">
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          <motion.div key={activeIndex} className="w-full h-full">
            {/* 1. UÇAN PARÇALAR */}
            {activeParts.map((part, index) => (
              <motion.div
                key={part.id}
                className="absolute w-48 h-48" // Parçacık boyutu da biraz daha büyütüldü.
                initial={part.initial}
                // Animasyon süresi ve gecikmesi yavaşlatıldı
                animate={{ ...part.animate, transition: { duration: TRANSFORMATION_DELAY, delay: index * 0.1, ease: [0.42, 0, 0.58, 1] } }}
              >
                <Image src={part.src} alt="malzeme" layout="fill" objectFit="contain" />
              </motion.div>
            ))}

            {/* 2. NİHAİ ÜRÜNÜN BELİRMESİ */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: 1, scale: 1,
                transition: { delay: TRANSFORMATION_DELAY - 0.5, duration: 1.5, ease: 'easeOut' }
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <Image src={slideWithDefaults.finalImage.src} alt={slideWithDefaults.productName} layout="fill" objectFit="cover" priority />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Kodun geri kalanı aynı */}
      <div className="absolute inset-0 z-30" ref={emblaRef}><div className="flex h-full">{slidesData.map(s => <div key={s.id} className="flex-shrink-0 basis-full h-full" />)}</div></div>
      <motion.div
        key={`${activeIndex}-text`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: TOTAL_ANIMATION_TIME } }}
        className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4"
      >
        <p className="text-lg font-semibold tracking-widest text-brand-red uppercase">{slideWithDefaults.productName}</p>
        <h1 className="text-4xl md:text-6xl font-poppins font-bold leading-tight mt-2">{slideWithDefaults.heroTitle}</h1>
        <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg">Menüyü İncele</Link>
      </motion.div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slidesData.map((_, index) => (
          <button key={index} onClick={() => emblaApi?.scrollTo(index)} className={`h-3 w-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}