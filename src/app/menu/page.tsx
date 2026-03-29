// Dosya Yolu: src/app/menu/page.tsx

'use client'; 

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
import ProductCard from '@/components/menu/ProductCard';
import ProductDetailModal from '@/components/menu/ProductDetailModal'; 
import CategoryButton from '@/components/menu/CategoryButton'; 

// Tipler
interface Product { id: number; name: string; description: string | null; price: number; image_url: string | null; ingredients: { name: string }[]; }
interface Category { id: number; name: string; products: Product[]; }
interface ProductWithCategoryName extends Product { categoryName: string; }

// Animasyon Variant'ları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    }
  },
}as const;


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
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (product: ProductWithCategoryName) => {
    setSelectedProduct(product);
  };
  
  if (loading) return <MenuSkeleton />;
  if (error) return <div className="bg-brand-background text-center py-20 text-red-500 font-sans">Hata: {error}</div>;

  return (
    <div className="bg-brand-background min-h-screen font-sans">
      <div className="container mx-auto px-4 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="flex flex-col gap-8 md:gap-14">
         {/* 
            DEĞİŞİKLİK BURADA: Başlık Konteyneri
            - 'flex flex-col items-center' eklendi: Bu div'i bir flex konteynerine dönüştürür,
              çocuklarını dikey olarak sıralar (flex-col) ve yatayda mükemmel bir şekilde ortalar (items-center).
          */}
          <div className="text-center flex flex-col items-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold italic text-center text-brand-dark mb-2">
              Lezzet Menümüz
            </h1>
            
            {/* 
              DEĞİŞİKLİK BURADA: Açıklama Paragrafı
              - 'mx-auto' kaldırıldı: Artık ortalamayı parent div yaptığı için bu class'a gerek yok.
              - 'max-w-l' (hatalı kullanım) -> 'max-w-xl' (doğru kullanım) olarak düzeltildi:
                Bu, paragrafın webde aşırı genişleyip okunmaz hale gelmesini engeller.
            */}
            <p className="text-brand-muted max-w-xl text-base">
              Usta ellerden çıkan, her biri özenle hazırlanan pide ve lahmacun çeşitlerimizi keşfedin.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <CategoryButton 
                label="Tümü"
                isSelected={selectedCategory === 'all'}
                onClick={(e) => handleCategoryClick(e, 'all')}
              />
              
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  label={category.name}
                  isSelected={selectedCategory === category.id}
                  onClick={(e) => handleCategoryClick(e, category.id)}
                />
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard 
                    product={product}
                    onCardClick={() => handleProductClick(product)} 
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-brand-muted py-10 mt-10">Bu kategoride gösterilecek ürün bulunmamaktadır.</p>
        )}

        <ProductDetailModal 
          isOpen={selectedProduct !== null}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}