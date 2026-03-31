'use client';

import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse pozisyonu için Motion Value'lar
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animasyonu: Daha akıcı ve "gecikmeli" (stiffness/damping) takip için
  const springConfig = { damping: 25, stiffness: 250 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Linklerin veya butonların üzerine gelindiğini algıla
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.getAttribute('role') === 'button';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, cursorX, cursorY]);

  // Mobil cihazlarda imleci gösterme (UX için en iyisidir)
  if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* 1. ANA İMLEÇ: Küçük, net bir nokta */}
      <motion.div
        className="fixed left-0 top-0 w-2 h-2 bg-white rounded-full z-[9999] pointer-events-none"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference', // ARKA PLANA GÖRE RENK DEĞİŞTİRİR (Çok Elit!)
        }}
      />

      {/* 2. TAKİPÇİ HALKA: Daha yavaş ve esnek takip eder */}
      <motion.div
        className="fixed left-0 top-0 z-[9998] rounded-full pointer-events-none border border-white/30"
        animate={{
          width: isHovered ? 80 : 40,
          height: isHovered ? 80 : 40,
          opacity: isVisible ? 1 : 0,
          x: cursorX.get(), 
          y: cursorY.get(),
        }}
        style={{
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
        transition={{
            type: "spring",
            stiffness: 150,
            damping: 20
        }}
      />
    </>
  );
}