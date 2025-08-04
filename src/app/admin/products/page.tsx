// Dosya Yolu: /src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductModal from '@/components/admin/ProductModal';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
// DEĞİŞİKLİK: Yeni tipleri import ediyoruz
import type { CleanProduct, Category } from '@/lib/types';
import { PlusIcon } from '@heroicons/react/24/solid';

const ITEMS_PER_PAGE = 10; // Bir sayfada kaç ürün gösterilecek?

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleanProduct | null>(null);
  
  // YENİ STATE'LER: Filtreleme ve Sayfalama için
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProductsAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // İki API isteğini aynı anda yapıyoruz (daha performanslı)
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/products?v=${new Date().getTime()}`),
        fetch(`/api/categories?v=${new Date().getTime()}`)
      ]);

      if (!productsRes.ok) throw new Error('Ürün verisi çekilemedi.');
      if (!categoriesRes.ok) throw new Error('Kategori verisi çekilemedi.');

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

  // FİLTRELEME VE SAYFALAMA MANTIĞI
  const paginatedProducts = useMemo(() => {
    // 1. Kategoriye göre filtrele
    const filtered = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category_id?.toString() === selectedCategory);

    // 2. Filtrelenmiş sonuçları sayfalara ayır
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return filtered.slice(startIndex, endIndex);
  }, [allProducts, selectedCategory, currentPage]);
  
  // Toplam sayfa sayısını hesapla
  const totalPages = useMemo(() => {
     const filteredCount = selectedCategory === 'all'
      ? allProducts.length
      : allProducts.filter(p => p.category_id?.toString() === selectedCategory).length;
    return Math.ceil(filteredCount / ITEMS_PER_PAGE);
  }, [allProducts, selectedCategory]);

  const handleDataChange = () => { fetchProductsAndCategories(); };
  const handleOpenNewModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEditModal = (product: CleanProduct) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };
  
  // Kategori filtresi değiştiğinde, sayfa numarasını 1'e sıfırla
  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Ürün Yönetimi</h1>
          <p className="mt-1 text-gray-500">Mevcut ürünleri düzenleyin veya yeni lezzetler ekleyin.</p>
        </div>
        <button 
          onClick={handleOpenNewModal} 
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* YENİ: FİLTRELEME ALANI */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-4">
         <label htmlFor="category-filter" className="font-semibold text-gray-700">Kategoriye Göre Filtrele:</label>
         <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
         >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
         </select>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <TableSkeleton rows={ITEMS_PER_PAGE} />
        ) : error ? (
          <p className="text-red-500">Hata: {error}</p>
        ) : (
          <ProductsTable 
            products={paginatedProducts} // Artık sayfalara ayrılmış veriyi gönderiyoruz
            onEdit={handleOpenEditModal} 
            onDeleteSuccess={handleDataChange} 
          />
        )}
      </div>

      {/* YENİ: SAYFALAMA KONTROLLERİ */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Önceki
          </button>
          <span className="font-semibold">{currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      )}
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={editingProduct}
        onSaveSuccess={handleDataChange}
      />
    </div>
  );
}