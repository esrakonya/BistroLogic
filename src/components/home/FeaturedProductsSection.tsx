// Dosya Yolu: /src/components/home/FeaturedProductsSection.tsx
'use client'; // Veriyi useEffect ile çekeceğimiz için bu bir istemci bileşeni olmalı.

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/components/menu/ProductCard';
import type { CleanProduct } from '@/lib/types'; // Product tipimizi import edelim.
import TableSkeleton from '../skeletons/TableSkeleton'; // Yükleme animasyonu için

export default function FeaturedProductsSection() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });

  // DEĞİŞİKLİK: Sahte veri yerine state'leri kullanıyoruz.
  const [products, setProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // DEĞİŞİKLİK: Veriyi API'den çekmek için useEffect kullanıyoruz.
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/featured-products?v=${new Date().getTime()}`);
        if (!res.ok) throw new Error("Veri çekilemedi");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Öne çıkan ürünler çekilirken hata:", error);
        // Hata durumunda boş bir dizi atayarak bölümün gizlenmesini sağlayabiliriz.
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (product: CleanProduct) => {
    setSelectedProductId(prevId => prevId === product.id ? null : product.id);
  };
  
  // Eğer yükleniyorsa bir iskelet gösterelim.
  if (loading) {
    return (
       <section className="bg-brand-background py-16 md:py-24">
         <div className="mx-auto">
           {/* Başlıkları da gösterebiliriz ki kullanıcı neyin yüklendiğini anlasın */}
            <div className="text-center mb-12 px-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold italic text-brand-dark">En Sevilenlerimiz</h2>
              <p className="mt-3 text-lg text-brand-muted max-w-xl mx-auto">Müşterilerimizin favorisi olan bu lezzetleri denemeden geçmeyin.</p>
            </div>
            <TableSkeleton rows={1} /> {/* Basit bir yükleme göstergesi */}
         </div>
       </section>
    )
  }

  // Eğer hiç öne çıkan ürün yoksa veya bir hata oluştuysa, bu bölümü hiç gösterme.
  if (!products || products.length === 0) {
    return null;
  }

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
        
        {/* Embla Carousel Slider */}
        <div className="overflow-hidden py-4" ref={emblaRef}>
          <div className="flex -ml-4 px-4">
            {products.map((product) => (
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