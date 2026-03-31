// Dosya Yolu: /src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductModal from '@/components/admin/ProductModal';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import type { CleanProduct, Category } from '@/lib/types';
import { 
  PlusIcon, 
  FunnelIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 8; 

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleanProduct | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProductsAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/products?v=${new Date().getTime()}`, { credentials: 'include' }),
        fetch(`/api/admin/categories?v=${new Date().getTime()}`, { credentials: 'include' })
      ]);

      if (!productsRes.ok) throw new Error('Failed to fetch products.');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories.');

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setAllProducts(productsData);
      setCategories(categoriesData);

    } catch (err: any) { 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchProductsAndCategories(); 
  }, [fetchProductsAndCategories]);

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category_id?.toString() === selectedCategory);
  }, [allProducts, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleDataChange = () => {
    fetchProductsAndCategories();
  };

  const handleOpenNewModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEditModal = (product: CleanProduct) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };
  
  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPage(page);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <ShoppingBagIcon className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Inventory</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-neutral-900 text-shadow-sm">Products Management</h1>
          <p className="text-neutral-500 font-light text-lg">Create, edit and organize your gourmet menu items.</p>
        </div>

        <button 
          onClick={handleOpenNewModal} 
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 px-8 rounded-full transition-all shadow-xl active:scale-95"
        >
          <PlusIcon className="h-5 w-5 stroke-2" />
          Add New Product
        </button>
      </div>

      {/* --- TOOLBAR: FILTERING --- */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
         <div className="flex items-center gap-3 px-4 py-2 bg-neutral-50 rounded-xl w-full sm:w-auto">
            <FunnelIcon className="h-4 w-4 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-600 whitespace-nowrap">Filter:</span>
            <select
               value={selectedCategory}
               onChange={handleCategoryFilterChange}
               className="bg-transparent text-sm font-bold text-neutral-900 focus:outline-none cursor-pointer min-w-[150px]"
            >
               <option value="all">All Categories</option>
               {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
               ))}
            </select>
         </div>
         <div className="ml-auto px-4 text-sm text-neutral-400 font-medium">
            Showing <span className="text-neutral-900">{filteredProducts.length}</span> products
         </div>
      </div>
      
      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8"><TableSkeleton rows={ITEMS_PER_PAGE} /></div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 font-medium">{error}</div>
        ) : (
          <ProductsTable 
            products={paginatedProducts} 
            onEdit={handleOpenEditModal} 
            onDeleteSuccess={handleDataChange} 
          />
        )}
      </div>

      {/* --- MODERN PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-4 pb-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
          >
            <ChevronLeftIcon className="h-5 w-5 text-neutral-900" />
          </button>
          
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-neutral-900">Page</span>
             <span className="bg-neutral-900 text-white px-3 py-1 rounded-md text-sm font-mono">{currentPage}</span>
             <span className="text-sm font-bold text-neutral-400">of {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
          >
            <ChevronRightIcon className="h-5 w-5 text-neutral-900" />
          </button>
        </div>
      )}
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={editingProduct}
        onSaveSuccess={handleDataChange}
      />
    </main>
  );
}