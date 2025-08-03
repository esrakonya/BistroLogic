// Dosya Yolu: /src/components/home/MagicHeroSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// --- YENİ VERİ YAPISI ---
// Artık 'parts' (parçalar) ve 'finalImage' (nihai ürün) olarak ikiye ayrılıyor.
const slidesData = [
  {
    id: 1,
    productName: 'Kuşbaşılı Pide',
    heroTitle: 'LEZZET SİMYASI',
    // Her bir parçanın kaynağı ve nereden geleceği
    parts: [
      { src: '/images/kusbasipide.jpg', initial: { x: '100vw', y: '10vh', scale: 0.8 } },
      { src: '/images/tomatoes.png', initial: { x: '-100vw', y: '40vh', scale: 0.7 } },
      { src: '/images/beef.png', initial: { y: '-100vh', x: '30vw', scale: 0.9 } },
    ],
    // Dönüşümden sonra ortaya çıkacak ana ürün
    finalImage: { src: '/images/pide-background.jpg' }
  },
  {
    id: 2,
    productName: 'Kaşarlı Pide',
    heroTitle: 'ALTIN ORAN',
    parts: [
      { src: '/images/cheese.png', initial: { x: '50vw', y: '-100vh', scale: 1.2 } },
      { src: '/images/part-tereyagi.png', initial: { x: '-100vw', y: '30vh' } },
    ],
    finalImage: { src: '/images/final-kasarli.png' }
  },
];

export default function MagicHeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const activeSlide = slidesData[activeIndex];
  const TRANSFORMATION_DELAY = 1.2; // Parçaların uçuş süresi
  const TOTAL_ANIMATION_TIME = TRANSFORMATION_DELAY + 0.5; // Toplam görsel animasyon süresi

  return (
    <section className="relative h-[70vh] min-h-[500px] text-white overflow-hidden -mt-8 -mx-4 bg-brand-dark">
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          <motion.div key={activeIndex} className="w-full h-full">
            {/* 1. UÇAN PARÇALAR */}
            {activeSlide.parts.map((part, index) => (
              <motion.div
                key={index}
                className="absolute w-1/4 h-1/4" // Parçaların boyutu
                initial={part.initial}
                // Merkeze doğru uçma ve dönüşüm animasyonu
                animate={{
                  x: '37.5vw', y: '30vh', // Ekranın ortasına yakın bir nokta
                  scale: 1,
                  transition: { duration: TRANSFORMATION_DELAY, delay: index * 0.2, ease: 'circOut' }
                }}
                // Dönüşümden sonra kaybolma animasyonu
                exit={{
                  opacity: 0, scale: 0, transition: { duration: 0.3 }
                }}
              >
                <Image src={part.src} alt="malzeme" layout="fill" objectFit="contain" />
              </motion.div>
            ))}

            {/* 2. NİHAİ ÜRÜNÜN BELİRMESİ */}
            <motion.div
              className="absolute w-1/2 h-1/2 left-[25%] top-[20%]" // Son ürünün boyutu ve konumu
              initial={{ opacity: 0, scale: 0.5 }}
              // Tam parçalar kaybolurken bu belirir
              animate={{
                opacity: 1, scale: 1,
                transition: { delay: TRANSFORMATION_DELAY, duration: 0.5, ease: 'backOut' }
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <Image src={activeSlide.finalImage.src} alt={activeSlide.productName} layout="fill" objectFit="contain"/>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sürükleme motoru ve diğer UI elemanları */}
      <div className="absolute inset-0 z-30" ref={emblaRef}><div className="flex h-full">{slidesData.map(s => <div key={s.id} className="flex-shrink-0 basis-full h-full" />)}</div></div>
      
      <motion.div
        key={activeIndex + '-text'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: TOTAL_ANIMATION_TIME } }}
        className="relative z-40 flex flex-col items-center justify-center h-full text-center p-4"
      >
        <p className="text-lg font-semibold tracking-widest text-brand-red uppercase">{activeSlide.productName}</p>
        <h1 className="text-4xl md:text-6xl font-poppins font-bold leading-tight mt-2">{activeSlide.heroTitle}</h1>
        <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg">Menüyü İncele</Link>
      </motion.div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slidesData.map((_, index) => (
          <button key={index} onClick={() => emblaApi?.scrollTo(index)} className={`h-3 w-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}