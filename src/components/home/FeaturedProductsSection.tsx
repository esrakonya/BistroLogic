// Dosya Yolu: /src/components/home/FeaturedProductsSection.tsx
'use client';

import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/components/menu/ProductCard';

const mostLovedProducts = [
  { id: 1, name: 'Kuşbaşılı Pide', description: 'Dana kuşbaşı, domates, biber ve özel baharatlar.', price: 150.00, image_url: '/images/pide-1.jpg' },
  { id: 3, name: 'Kıymalı Pide', description: 'Özel baharatlı dana kıyma, soğan ve maydanoz.', price: 140.00, image_url: '/images/pide-3.jpg' },
  { id: 4, name: 'Lahmacun', description: 'İncecik hamur üzerine zırh kıyması ve taze sebzeler.', price: 80.00, image_url: '/images/pide-4.jpg' },
  { id: 2, name: 'Kaşarlı Pide', description: 'Bolca erimiş kaşar peyniri ve tereyağı.', price: 120.00, image_url: '/images/pide-2.jpg' },
];

interface Product { id: number; name: string; description: string | null; price: number; image_url: string | null; }

export default function FeaturedProductsSection() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
  };

  return (
    <section className="bg-brand-background py-16 md:py-24">
      <div className="container mx-auto">
        {/* Başlık Bölümü */}
        <div className="text-center mb-12 px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold italic text-brand-dark">
            En Sevilenlerimiz
          </h2>
          <p className="mt-3 text-lg text-brand-muted max-w-xl mx-auto">
            Müşterilerimizin favorisi olan bu lezzetleri denemeden geçmeyin.
          </p>
        </div>
        
        {/* 
          DEĞİŞİKLİK BURADA:
          Slider'ın ana kapsayıcısına küçük bir padding (p-2) ekleyerek, kartların etrafında 
          oluşacak olan çerçevenin 'overflow-hidden' tarafından kesilmesini engelliyoruz.
          Eklediğimiz padding'in genel layout'u bozmamasını sağlamak için de
          aynı miktarda negatif margin (-m-2) ekliyoruz. Bu, çerçevenin görünmesi için
          "nefes alma alanı" yaratır.
        */}
        <div className="overflow-hidden p-2 -m-2" ref={emblaRef}>
          <div className="flex -ml-4">
            {mostLovedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 flex-grow-0 basis-4/5 sm:basis-1/2 lg:basis-1/3 pl-4">
                <ProductCard
                  product={product}
                  onCardClick={() => handleProductClick(product)}
                  isSelected={product.id === selectedProductId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}