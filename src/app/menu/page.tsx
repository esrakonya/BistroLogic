// Dosya Yolu: src/app/menu/page.tsx
'use client'; 

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
import ProductCard from '@/components/menu/ProductCard';
import ProductDetailModal from '@/components/menu/ProductDetailModal'; 
import CategoryButton from '@/components/menu/CategoryButton'; 
import { Squares2X2Icon } from '@heroicons/react/24/outline';

// Types
interface Product { id: number; name: string; description: string | null; price: number; image_url: string | null; ingredients: { name: string }[]; }
interface Category { id: number; name: string; products: Product[]; }
interface ProductWithCategoryName extends Product { categoryName: string; }

// Animasyonlar: Daha akışkan ve "Luxury" bir his için
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 20, stiffness: 100 }
  },
} as const;

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
          throw new Error(errorData.error || 'Failed to sync with the kitchen.');
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
    if (selectedProduct) setSelectedProduct(null);
    setSelectedCategory(categoryId);
  };

  if (loading) return <MenuSkeleton />;
  
  if (error) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-md border border-red-100">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl font-bold">!</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Connection Error</h2>
            <p className="text-neutral-500 font-light mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold text-sm transition-transform active:scale-95">Try Again</button>
        </div>
    </div>
  );

  return (
    <main className="bg-neutral-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        
        {/* --- DYNAMIC HEADER SECTION --- */}
        <header className="flex flex-col items-center text-center mb-16 md:mb-24 space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 p-2 rounded-xl mb-2">
            <Squares2X2Icon className="h-6 w-6 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <span className="text-neutral-400 uppercase tracking-[0.4em] text-xs font-bold block">Taste the Excellence</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-900 tracking-tight leading-none">
              Signature Menu
            </h1>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              Explore our handcrafted selection of gourmet dishes, where every ingredient tells a story of quality and passion.
            </p>
          </div>
        </header>

        {/* --- CATEGORY NAVIGATION --- */}
        <nav className="flex justify-center mb-16 sticky top-24 z-30">
          <div className="bg-white/70 backdrop-blur-xl p-2 rounded-full shadow-2xl shadow-neutral-200/50 border border-white/20 flex flex-wrap justify-center items-center gap-2">
            <CategoryButton 
              label="All Selection"
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
        </nav>
        
        {/* --- PRODUCT GRID --- */}
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedCategory} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard 
                  product={product}
                  onCardClick={() => setSelectedProduct(product)} 
                />
              </motion.div>
            ))}
          </motion.section>
        </AnimatePresence>
        
        {/* --- EMPTY STATE --- */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-6xl">🍽️</div>
            <p className="text-neutral-400 font-serif italic text-xl">This category is currently being updated...</p>
          </div>
        )}

        {/* --- PRODUCT MODAL --- */}
        <ProductDetailModal 
          isOpen={selectedProduct !== null}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </main>
  );
}