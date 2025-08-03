// Dosya Yolu: src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductModal from '@/components/admin/ProductModal';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import type { CleanProduct } from '@/lib/types';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ProductsPage() {
  const [products, setProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleanProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/products?v=${new Date().getTime()}`);
      if (!res.ok) throw new Error('Ürün verisi çekilemedi.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) { 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  const handleDataChange = () => { fetchProducts(); };
  const handleOpenNewModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEditModal = (product: CleanProduct) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };

  return (
    // DEĞİŞİKLİK: Sayfa genel bir 'space-y' ile daha düzenli hale getirildi.
    <div className="space-y-8">
      {/* DEĞİŞİKLİK: Başlık ve Buton Alanı */}
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
      
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <p className="text-red-500">Hata: {error}</p>
        ) : (
          <ProductsTable 
            products={products} 
            onEdit={handleOpenEditModal} 
            onDeleteSuccess={handleDataChange} 
          />
        )}
      </div>
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={editingProduct}
        onSaveSuccess={handleDataChange}
      />
    </div>
  );
}