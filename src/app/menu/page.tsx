// Dosya Yolu: src/app/menu/page.tsx

'use client'; 

import { useState, useEffect, MouseEvent } from 'react';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
import ProductCard from '@/components/menu/ProductCard';
// --- YENİ BİLEŞENİ İMPORT EDİYORUZ ---
import ProductDetailModal from '@/components/menu/ProductDetailModal'; 

// Tiplerimizi burada daha sade tutabiliriz
interface Product { id: number; name: string; description: string | null; price: number; image_url: string | null; ingredients: { name: string }[]; }
interface Category { id: number; name: string; products: Product[]; }
interface ProductWithCategoryName extends Product { categoryName: string; }

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategoryName | null>(null);

  useEffect(() => {
    const getMenuData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/menu?v=${new Date().getTime()}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Menü verisi alınamadı: ${errorData.error || res.statusText}`);
        }
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getMenuData();
  }, []); 

  const filteredProducts: ProductWithCategoryName[] = 
    selectedCategory === 'all'
      ? categories.flatMap(category => 
          category.products.map(product => ({ ...product, categoryName: category.name }))
        )
      : (() => {
          const category = categories.find(c => c.id === selectedCategory);
          return category ? category.products.map(product => ({ ...product, categoryName: category.name })) : [];
        })();
  
  const handleCategoryClick = (e: MouseEvent<HTMLButtonElement>, categoryId: number | 'all') => {
    e.stopPropagation();
    if (selectedProduct) {
      setSelectedProduct(null);
    }
    setTimeout(() => {
      setSelectedCategory(categoryId);
    }, 150);
  };

  const handleProductClick = (product: ProductWithCategoryName) => {
    setSelectedProduct(product);
  };
  
  if (loading) return <MenuSkeleton />;
  if (error) return <div className="bg-brand-background text-center py-20 text-red-500 font-sans">Hata: {error}</div>;

  return (
    <div className="bg-brand-background min-h-screen font-sans">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col gap-10 md:gap-14">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold italic text-center text-brand-dark mb-4">
              Lezzet Menümüz
            </h1>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Usta ellerden çıkan, her biri özenle hazırlanan pide ve lahmacun çeşitlerimizi keşfedin.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center items-center bg-brand-surface/60 p-1.5 rounded-full shadow-sm border border-brand-border/80 gap-2">
              <button
                onClick={(e) => handleCategoryClick(e, 'all')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-background ${selectedCategory === 'all' ? 'bg-brand-red text-white shadow' : 'text-brand-dark hover:bg-brand-surface'}`}
              >
                Tümü
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={(e) => handleCategoryClick(e, category.id)}
                  className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-background ${selectedCategory === category.id ? 'bg-brand-red text-white shadow' : 'text-brand-dark hover:bg-brand-surface'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onCardClick={() => handleProductClick(product)} 
              />
            ))}
          </div>
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-brand-muted py-10 mt-10">Bu kategoride gösterilecek ürün bulunmamaktadır.</p>
        )}

        {/* --- MODAL ARTIK TEK BİR TEMİZ BİLEŞEN --- */}
        <ProductDetailModal 
          isOpen={selectedProduct !== null}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
        {/* --- REFACTORING SONU --- */}
      </div>
    </div>
  );
}