import { useState, useEffect } from 'react';

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let requestRef: number;
    let currentX = 0;
    let currentY = 0;

    // Fare pozisyonunu sadece değişkenlerde tutuyoruz (State'i yormuyoruz)
    const handleMouseMove = (ev: MouseEvent) => {
      currentX = ev.clientX;
      currentY = ev.clientY;
    };

    // State güncellemesini ekranın yenilenme hızına (FPS) senkronize ediyoruz
    const updatePosition = () => {
      setMousePosition({ x: currentX, y: currentY });
      requestRef = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef = requestAnimationFrame(updatePosition);

    // Temizleme fonksiyonu: Memory leak (bellek sızıntısı) önlemek için kritik
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return mousePosition;
}