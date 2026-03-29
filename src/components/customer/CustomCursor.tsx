'use client';

import { motion } from 'framer-motion';
import useMousePosition from '@/hooks/useMousePosition';

export default function CustomCursor() {
  const { x, y } = useMousePosition();

  // İmlecin merkezini fare pozisyonuna getirmek için offset
  const cursorSize = 40;

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 rounded-full pointer-events-none"
      style={{
        width: cursorSize,
        height: cursorSize,
        // Işık hüzmesi efekti için
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
        border: '1px solid rgba(255,255,255,0.3)',
      }}
      animate={{
        x: x - cursorSize / 2,
        y: y - cursorSize / 2,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    />
  );
}