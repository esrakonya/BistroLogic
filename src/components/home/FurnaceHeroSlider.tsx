'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const slideData = {
    id: 1, productName: 'Kuşbaşılı Pide', heroTitle: 'ATEŞTEN DOĞAN LEZZET',
    ingredients: [
        { src: '/images/beef.png' }, { src: '/images/cheese.png' },
        { src: '/images/dough.png' }, { src: '/images/tomatoes.png' },
        { src: '/images/green-pepper.png' }, { src: '/images/red-pepper.png' },
    ],
    partCount: 30,
    furnaceImage: { src: '/images/tas-firin.jpg' },
    finalImage: { src: '/images/pides/kusbasipide.png' },
    // DÜZELTME: Silinen bu satırı geri ekliyoruz.
    productBackground: { src: '/images/backgrounds/pide-background.jpg' } 
};

const generateFlyingParts = (ingredients: {src: string}[], count: number) => {
    const parts = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 40 + 60;
        const initialPos = {
            x: `calc(50vw + ${Math.cos(angle) * radius}vw)`,
            y: `calc(40vh + ${Math.sin(angle) * radius}vh)`,
        };
        parts.push({
            src: ingredients[i % ingredients.length].src, id: `${Date.now()}-${i}`,
            initial: { ...initialPos, scale: Math.random() * 0.5 + 1.0, rotate: Math.random() * 300 - 150 },
            animate: { 
                x: '50vw', y: '40vh', 
                translateX: '-50%', translateY: '-50%', 
                scale: 0.8,
                opacity: 1,
                rotate: 0 
            }
        });
    }
    return parts;
};

export default function FurnaceHeroSlider() {
  type AnimationStage = 'fire' | 'ingredients' | 'product';
  const [stage, setStage] = useState<AnimationStage>('fire');
  const activeParts = useMemo(() => generateFlyingParts(slideData.ingredients, slideData.partCount), []);

  useEffect(() => {
    setStage('fire'); 
    const timer1 = setTimeout(() => setStage('ingredients'), 500);  
    const timer2 = setTimeout(() => setStage('product'), 4000); 
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-black overflow-hidden">
      <AnimatePresence>
        {/* Aşama 1: Ateş Arka Planı (z-10) */}
        {(stage === 'fire' || stage === 'ingredients') && (
          <motion.div key="fire" className="absolute inset-0 z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeOut' } }}
            transition={{ duration: 1 }}>
            <Image src={slideData.furnaceImage.src} alt="Odun Ateşi" fill sizes="100vw" className="object-cover" priority/>
          </motion.div>
        )}

        {/* Aşama 2: Nihai Ürün Arka Planı (z-30) */}
        {stage === 'product' && (
          <motion.div key="product" className="absolute inset-0 z-30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}>
             {/* Artık bu satır hata vermeyecektir. */}
             <Image src={slideData.productBackground.src} alt="Sunum Arka Planı" fill sizes="100vw" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Uçan Malzemeler */}
        {stage === 'ingredients' && activeParts.map((part) => (
          <motion.div
            key={part.id}
            className="absolute w-48 h-48 z-20 drop-shadow-2xl" 
            initial={part.initial}
            animate={{...part.animate, transition: { duration: 3.0, delay: Math.random() * 0.5, ease: 'easeIn' }}}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
          >
            <Image src={part.src} alt="" fill sizes="192px" className="object-contain"/>
          </motion.div>
        ))}
        
        {/* Nihai Ürün Pide (z-40) */}
        {stage === 'product' && (
            <motion.div
                key="pide-final"
                className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center text-white pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <motion.div
                    className="relative w-11/12 md:w-1/2 max-w-xl z-10"
                    initial={{ y: 50, scale: 0.8 }}
                    animate={{ y: 0, scale: 1, transition: { type: 'spring', duration: 1.5, delay: 0.5 } }}>
                    <Image src={slideData.finalImage.src} alt={slideData.productName} width={800} height={600}
                        sizes="(max-width: 768px) 90vw, 50vw" className="object-contain"/>
                </motion.div>
                <motion.h1
                    className="text-5xl md:text-7xl font-serif font-bold italic mt-4 z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 1, delay: 1 } }}>
                    {slideData.heroTitle}
                </motion.h1>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}