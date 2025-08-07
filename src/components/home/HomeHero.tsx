'use client';

// DEĞİŞİKLİK: 'useMemo' artık animasyon parçaları için kullanılmadığından import'tan kaldırıldı.
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// AŞAMA 2: SLIDER VERİLERİ (Değişiklik yok)
const slidesData = [
  {
    id: 1, heroTitle: 'ATEŞTEN DOĞAN LEZZET', heroSubtitle: 'Odun ateşinde, özel baharatlarla marine edilmiş dana kuşbaşı.',
    productName: 'Kuşbaşılı Pide',
    backgroundUrl: '/images/pide-background.jpg',
  },
  {
    id: 2, heroTitle: 'VAZGEÇİLMEZ KLASİK', heroSubtitle: 'Bolca erimiş Karadeniz kaşarı ve çıtır hamurun mükemmel buluşması.',
    productName: 'Kaşarlı Pide',
    backgroundUrl: '/images/pide-2.jpg',
  },
  {
    id: 3, heroTitle: 'GELENEĞİN ZİRVESİ', heroSubtitle: 'Zırhta çekilmiş dana kıyması, taze domates ve maydanoz.',
    productName: 'Kıymalı Pide',
    backgroundUrl: '/images/pide-3.jpg',
  }
];

// AŞAMA 1: GİRİŞ ANİMASYONU VERİLERİ (Değişiklik yok)
const introData = {
    ingredients: [
        { src: '/images/beef.png' }, { src: '/images/cheese.png' },
        { src: '/images/dough.png' }, { src: '/images/tomatoes.png' },
        { src: '/images/green-pepper.png' }, { src: '/images/red-pepper.png' },
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
            initial: { ...initialPos, scale: Math.random() * 0.5 + 1.0, opacity: 0.8 },
            animate: { x: '50vw', y: '40vh', translateX: '-50%', translateY: '-50%', scale: 0, opacity: 0 }
        });
    }
    return parts;
};

// Yazı animasyonları için variantlar (Değişiklik yok)
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
} as const;

const textChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function PideEfsanesiHero() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isReadyForReset, setIsReadyForReset] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  // DEĞİŞİKLİK: Hydration hatasını çözmek için 'useMemo' yerine 'useState' kullanıyoruz.
  // Sunucuda bu liste boş olacak, böylece uyuşmazlık olmayacak.
  const [activeParts, setActiveParts] = useState<ReturnType<typeof generateFlyingParts>>([]);
  
  // DEĞİŞİKLİK: Animasyon parçalarını sadece istemci tarafında oluşturan useEffect.
  // Bu kod sadece tarayıcıda çalıştığı için 'Math.random' hataya neden olmaz.
  useEffect(() => {
    if (!isIntroComplete) {
      setActiveParts(generateFlyingParts(introData.ingredients, introData.partCount));
    }
  }, [isIntroComplete]);

  // Giriş animasyonunu yöneten useEffect (Değişiklik yok)
  useEffect(() => {
    if (!isIntroComplete) {
        const totalIntroTime = 3000;
        const timer = setTimeout(() => {
            setIsIntroComplete(true);
        }, totalIntroTime);
        return () => clearTimeout(timer);
    }
  }, [isIntroComplete]);

  // Embla slider'ını yöneten ve animasyonu resetleyen useEffect (Değişiklik yok)
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
        const newIndex = emblaApi.selectedScrollSnap();
        setActiveIndex(newIndex);
        if (newIndex === 0 && isReadyForReset) {
            setIsIntroComplete(false);
            setIsReadyForReset(false);
        }
        if (newIndex !== 0) {
            setIsReadyForReset(true);
        }
    };
    emblaApi.on('select', onSelect);
    if(isIntroComplete) {
        onSelect();
    }
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, isIntroComplete, isReadyForReset]);

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-black text-white overflow-hidden">
        {/* ARKA PLAN YÖNETİMİ (Değişiklik yok) */}
        <div className="absolute inset-0 z-0">
            <Image src={introData.furnaceImage.src} alt="Odun Ateşi" fill className="object-cover" priority/>
        </div>
        <div className="absolute inset-0 z-[5]">
            <AnimatePresence>
                {isIntroComplete && (
                    <motion.div 
                        key={slidesData[activeIndex].id} 
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 1.0, ease: 'easeIn' } }}
                        exit={{ opacity: 0, transition: { duration: 1.0, ease: 'easeOut' } }} 
                    >
                        <Image src={slidesData[activeIndex].backgroundUrl} alt={slidesData[activeIndex].productName} fill className="object-cover"/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* ÖN PLAN YÖNETİMİ (Değişiklik yok) */}
        <div className="relative z-20 h-full">
            <AnimatePresence>
                {!isIntroComplete && (
                    <motion.div key="intro-animation" className="w-full h-full">
                        {activeParts.map((part) => (
                            <motion.div key={part.id} className="absolute w-48 h-48"
                                initial={part.initial} animate={part.animate}
                                exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
                                transition={{ duration: 2.5, ease: "easeIn" }}>
                                <Image src={part.src} alt="" fill sizes="192px" className="object-contain drop-shadow-2xl"/>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {isIntroComplete && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeIndex} variants={textVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center">
                            <motion.p variants={textChildVariants} className="text-lg font-semibold tracking-widest text-brand-red uppercase">
                                {slidesData[activeIndex].productName}
                            </motion.p>
                            <motion.h1 variants={textChildVariants} className="text-4xl md:text-6xl font-serif font-bold italic leading-tight mt-2">
                                {slidesData[activeIndex].heroTitle}
                            </motion.h1>
                            <motion.p variants={textChildVariants} className="mt-4 mb-6 text-lg md:text-xl max-w-2xl mx-auto">
                                {slidesData[activeIndex].heroSubtitle}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                    
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition:{ delay: 0.8 } }}>
                        <Link href="/menu" className="mt-8 bg-brand-red hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                            Menüyü İncele
                        </Link>
                    </motion.div>
                </div>
            )}
        </div>

        {/* Embla Carousel ve Butonlar (Değişiklik yok) */}
        {isIntroComplete && (
            <>
                 <div className="absolute inset-0 z-15" ref={emblaRef}>
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