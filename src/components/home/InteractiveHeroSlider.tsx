  'use client';
  
  import { useState, useEffect, useMemo } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import Image from 'next/image';
  import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
  
  // Veri yapıları aynı
  const slidesData = [
    {
      id: 1, heroTitle: 'ATEŞTEN DOĞAN LEZZET', heroSubtitle: 'Odun ateşinde, özel baharatlarla marine edilmiş dana kuşbaşı.',
      productName: 'Kuşbaşılı Pide', imageUrl: '/images/pides/kusbasipide.png',
      backgroundUrl: '/images/backgrounds/pide-background.jpg',
    },
    {
      id: 2, heroTitle: 'VAZGEÇİLMEZ KLASİK', heroSubtitle: 'Bolca erimiş Karadeniz kaşarı ve çıtır hamurun mükemmel buluşması.',
      productName: 'Kaşarlı Pide', imageUrl: '/images/pides/kasarli-pide-bg.png',
      backgroundUrl: '/images/backgrounds/pide-background-2.jpg',
    },
    {
      id: 3, heroTitle: 'GELENEĞİN ZİRVESİ', heroSubtitle: 'Zırhta çekilmiş dana kıyması, taze domates ve maydanoz.',
      productName: 'Kıymalı Pide', imageUrl: '/images/pides/kiymali-pide-bg.png',
      backgroundUrl: '/images/backgrounds/pide-background-3.jpg',
    }
  ];
  const introData = {
      ingredients: [
          { src: '/images/ingredients/beef.png' }, { src: '/images/ingredients/cheese.png' },
          { src: '/images/ingredients/dough.png' }, { src: '/images/ingredients/tomatoes.png' },
          { src: '/images/ingredients/green-pepper.png' }, { src: '/images/ingredients/red-pepper.png' },
      ],
      partCount: 25,
      furnaceImage: { src: '/images/tas-firin.jpg' },
  };
  
  const generateFlyingParts = (ingredients: {src: string}[], count: number) => {
      const parts = [];
      for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 40 + 60;
          const initialPos = { x: `calc(50vw + ${Math.cos(angle) * radius}vw)`, y: `calc(40vh + ${Math.sin(angle) * radius}vh)` };
          parts.push({
              src: ingredients[i % ingredients.length].src, id: `${Date.now()}-${i}`,
              initial: { ...initialPos, scale: Math.random() * 0.5 + 1.0 },
              animate: { x: '50vw', y: '40vh', translateX: '-50%', translateY: '-50%', scale: 0.8, opacity: 1 },
              // DÜZELTME: exit objesini buradan kaldırıyoruz.
          });
      }
      return parts;
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  } as const;
  
  export default function PideEfsanesiHero() {
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [activeIndex, setActiveIndex] = useState(0);
    const activeParts = useMemo(() => generateFlyingParts(introData.ingredients, introData.partCount), []);
  
    useEffect(() => {
      const totalIntroTime = 4500;
      const timer = setTimeout(() => { setIsIntroComplete(true); }, totalIntroTime);
      return () => clearTimeout(timer);
    }, []);
  
    useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
      emblaApi.on('select', onSelect);
      return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);
  
    return (
      <section className="relative h-[85vh] min-h-[600px] bg-black text-white overflow-hidden">
          <AnimatePresence>
              {!isIntroComplete ? (
                  <motion.div key="intro-bg" className="absolute inset-0">
                       <Image src={introData.furnaceImage.src} alt="Odun Ateşi" fill className="object-cover" priority/>
                  </motion.div>
              ) : (
                  <motion.div key={activeIndex} className="absolute inset-0">
                      <Image src={slidesData[activeIndex].backgroundUrl} alt="Pide Arka Planı" fill className="object-cover" />
                  </motion.div>
              )}
          </AnimatePresence>
        
          <AnimatePresence>
              {!isIntroComplete ? (
                  activeParts.map((part) => (
                      <motion.div key={part.id} className="absolute w-48 h-48 z-20"
                          initial={part.initial} 
                          animate={part.animate}
                          // DÜZELTME: exit objesini doğrudan buraya, doğru tiple yazıyoruz.
                          exit={{ opacity: 0, scale: 0, transition: { duration: 0.5, ease: "easeIn" } }}
                          transition={{ duration: 3.5, ease: "easeIn" }} >
                          <Image src={part.src} alt="" fill sizes="192px" className="object-contain drop-shadow-2xl"/>
                      </motion.div>
                  ))
              ) : (
                  <div className="absolute inset-0 z-20">
                      <div className="absolute inset-0 bg-black/50"></div>
                       <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4">
                          <AnimatePresence mode="wait">
                              <motion.div key={activeIndex} variants={textVariants} initial="hidden" animate="visible" exit="exit">
                                  <p className="text-lg font-semibold tracking-widest text-brand-red uppercase">{slidesData[activeIndex].productName}</p>
                                  <h1 className="text-4xl md:text-6xl font-serif font-bold italic leading-tight mt-2">{slidesData[activeIndex].heroTitle}</h1>
                                  <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">{slidesData[activeIndex].heroSubtitle}</p>
                              </motion.div>
                          </AnimatePresence>
                          
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition:{ delay: 0.5 } }}>
                               <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                                  Menüyü İncele
                               </Link>
                          </motion.div>
                       </div>
                  </div>
              )}
          </AnimatePresence>
  
          {isIntroComplete && (
              <>
                   <div className="absolute inset-0 z-10" ref={emblaRef}>
                       <div className="flex h-full">
                           {slidesData.map((slide) => <div key={slide.id} className="flex-shrink-0 basis-full h-full"></div>)}
                       </div>
                   </div>
                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                       {slidesData.map((_, index) => (
                           <button key={index} onClick={() => emblaApi?.scrollTo(index)}
                               className={`h-3 w-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/40'}`}/>
                       ))}
                   </div>
              </>
          )}
      </section>
    );
  }