// Dosya Yolu: /src/components/home/FlavorStormSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// --- "LEZZET YAĞMURU" VERİ YAPISI ---
// Kuşbaşı Pide slaytı için kullanılacak malzeme görselleri.
const kusbasiIngredients = [
  { src: '/images/beef.png' },
  { src: '/images/cheese.png' },
  { src: '/images/green-pepper.png' },
  { src: '/images/red-pepper.png' },
  { src: '/images/tomatoes.png' },
];

// Bu fonksiyon, ekranı dolduracak çok sayıda parçacık üretir.
// Her parçacığa rastgele bir başlangıç/bitiş konumu ve boyut atar.
const generateParts = (ingredients: {src: string}[], count: number) => {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const side = Math.floor(Math.random() * 4); // 0:sol, 1:sağ, 2:üst, 3:alt
    const initialPos = {
      x: side === 0 ? '-100%' : side === 1 ? '100%' : `${Math.random() * 100}vw`,
      y: side === 2 ? '-100%' : side === 3 ? '100%' : `${Math.random() * 100}vh`,
    };
    parts.push({
      ...ingredients[i % ingredients.length], // Malzemeleri sırayla tekrar kullan
      id: i,
      initial: { ...initialPos, scale: Math.random() * 0.5 + 0.5, rotate: Math.random() * 180 - 90 },
      // Animasyonun sonunda ekranın rastgele bir noktasına yerleşir.
      animate: {
        x: `${Math.random() * 80 + 10}vw`, // %10 ile %90 arası
        y: `${Math.random() * 70 + 10}vh`, // %10 ile %80 arası
        scale: 1,
        rotate: 0,
      },
      size: `w-${Math.floor(Math.random() * 20) + 20} h-${Math.floor(Math.random() * 20) + 20}`, // Rastgele boyut (w-20/h-20 to w-40/h-40)
    });
  }
  return parts;
};

const slidesData = [
  {
    id: 1,
    productName: 'Kuşbaşılı Pide',
    heroTitle: 'LEZZET FIRTINASI',
    parts: generateParts(kusbasiIngredients, 20), // 20 adet malzeme parçacığı oluştur
    finalImage: { src: '/images/pide-background.jpg' } // Bu, en arkada belirecek tam ekran resim
  },
  {
    id: 2,
    productName: 'Kaşarlı Pide',
    heroTitle: 'SAFKAN LEZZET',
    // Kaşarlı pide için farklı malzemeler ve daha az sayıda parçacık olabilir.
    parts: generateParts([{ src: '/images/cheese.png' }, { src: '/images/tomatoes.png' }], 15),
    finalImage: { src: '/images/pide-background-2.jpg' }
  },
];

export default function FlavorStormSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const activeSlide = slidesData[activeIndex];
  const FADE_IN_TIME = 2.5; // Malzemelerin ekranda kalma süresi

  return (
    <section className="relative h-[70vh] min-h-[500px] text-white overflow-hidden -mt-8 -mx-4 bg-brand-dark">
      <AnimatePresence>
        <motion.div key={activeIndex} className="absolute inset-0">
          {/* 1. NİHAİ ARKA PLAN (En altta, görünmez başlar) */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: FADE_IN_TIME, duration: 0.8 } }}
          >
            <Image src={activeSlide.finalImage.src} alt={activeSlide.productName} layout="fill" objectFit="cover" priority/>
          </motion.div>

          {/* 2. MALZEME YAĞMURU (Arka planın üstünde) */}
          {activeSlide.parts.map((part, i) => (
            <motion.div
              key={part.id}
              className={`absolute ${part.size} z-10`}
              initial={part.initial}
              animate={{ ...part.animate, transition: { duration: 2.0, delay: i * 0.05, ease: 'easeOut' } }}
              // Belirli bir süre sonra kaybolur
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
            >
              <Image src={part.src} alt="malzeme" layout="fill" objectFit="contain" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Karartma ve diğer UI elemanları */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
      <div className="absolute inset-0 z-40" ref={emblaRef}><div className="flex h-full">{slidesData.map(s => <div key={s.id} className="flex-shrink-0 basis-full h-full" />)}</div></div>
      
      <motion.div
        key={`${activeIndex}-text`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: FADE_IN_TIME + 0.5 } }}
        className="relative z-30 flex flex-col items-center justify-center h-full text-center p-4"
      >
        <p className="text-lg font-semibold tracking-widest text-brand-red uppercase">{activeSlide.productName}</p>
        <h1 className="text-4xl md:text-6xl font-poppins font-bold leading-tight mt-2">{activeSlide.heroTitle}</h1>
        <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg">Menüyü İncele</Link>
      </motion.div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slidesData.map((_, index) => (
          <button key={index} onClick={() => emblaApi?.scrollTo(index)} className={`h-3 w-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}