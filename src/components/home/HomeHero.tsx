'use client';

import { useState, useEffect, act } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';


const slidesData = [
  {
    id: 1, heroTitle: "CHEF'S SELECTION", 
    heroSubtitle: 'Excellence in Every Ingredient',
    productName: 'Signature Platter',
    backgroundUrl: '/images/hero-1.webp',
  },
  {
    id: 2, heroTitle: 'FRESH & ORGANIC', 
    heroSubtitle: 'From Garden Directly to Your Table',
    productName: 'Seasonal Harvest',
    backgroundUrl: '/images/hero-2.webp',
  },
  {
    id: 3, heroTitle: 'MODERN AMBIANCE', 
    heroSubtitle: 'Memorable Moments With Loved Ones',
    productName: 'Gourmet Experience',
    backgroundUrl: '/images/hero-3.webp',
  }
];

const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
} as const;
  
const textChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export default function HeroSection() {
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsIntroComplete(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        };
        emblaApi.on('select', onSelect);
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    return (
        <section className='relative h-[90vh] min-h-[700px] bg-white overflow-hidden'>
            {/** BACKGROUND LAYER - SLIDER */}
            <div className='absolute inset-0 z-0'>
                <AnimatePresence mode='wait'>
                    {
                        isIntroComplete && (
                            <motion.div
                                key={slidesData[activeIndex].id}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity:0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className='absolute inset-0'
                            >
                                <Image
                                    src={slidesData[activeIndex].backgroundUrl}
                                    alt={slidesData[activeIndex].productName}
                                    fill
                                    className='object-cover'
                                    priority
                                />
                                <div className='absolute inset-0 bg-black/30'></div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {
                    !isIntroComplete && (
                        <motion.div
                            key="intro"
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 1 }}
                            className='absolute inset-0 z-50 bg-neutral-50 flex items-center justify-center'
                        >
                            <motion.h2
                                initial={{ opacity: 0, letterSpacing: "0.2em", filter: "blur(5px)" }}
                                animate={{ opacity: 1, letterSpacing: "0.6em", filter: "blur(0px)" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className='text-4xl md:text-7xl font-light text-neutral-900'
                            >
                                SEVERLY
                            </motion.h2>
                        </motion.div>
                    )
                }
            </AnimatePresence>
            
            
            {/** FRONT CONTENT */}
            <div className='relative z-20 h-full flex items-center justify-center'>
                {
                    isIntroComplete && (
                        <div className='text-center px-4 max-w-4xl text-white'>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.6, staggerChildren: 0.2 }}
                                >
                                    <motion.span
                                        className='inline-block px-4 py-1 border border-white/40 rounded-full text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-6 bg-white/10 backdrop-blur-sm'
                                    >
                                        {slidesData[activeIndex].productName}
                                    </motion.span>

                                    <motion.h1 className='text-5xl md:text-8xl font-serif font-bold leading-tight drop-shadow-xl'>
                                        {slidesData[activeIndex].heroTitle}
                                    </motion.h1>

                                    <motion.p className='mt-6 text-lg md:text-2xl font-light text-white/90 tracking-wide max-w-2xl mx-auto'>
                                        {slidesData[activeIndex].heroSubtitle}
                                    </motion.p>

                                    <motion.div className='mt-10'>
                                        <Link
                                            href="/menu"
                                            className='bg-white text-black hover:bg-neutral-100 px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105 inline-block'
                                        >
                                            EXPLORE MENU
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )
                }
            </div>

            {/* Indicators */}
            {
                isIntroComplete && (
                    <div className='absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4'>
                        {slidesData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={`h-0.5 transition-all duration-500 ${index === activeIndex ? 'bg-white w-12' : 'bg-white/30 w-6'}`}
                            />
                        ))}
                    </div>
                )
            }

            {/* Embla Carousel Helper Layer */}
            <div className='absolute inset-0 z-15 cursor-grab' ref={emblaRef}>
                <div className='flex h-full'>
                    {slidesData.map((slide) => <div key={slide.id} className='flex-shrink-0 basis-full h-full'></div>)}
                </div>
            </div>
        </section>
    );
}