// Dosya Yolu: src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductModal from '@/components/admin/ProductModal';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import type { CleanProduct } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleanProduct | null>(null);

  // Bu fonksiyon, tüm veri çekme ve yenileme işlemlerinin merkezidir.
  const fetchProducts = useCallback(async () => {
    // setLoading(true); // Yenileme sırasında tam ekran yükleme olmasın
    setError(null);
    try {
      // Admin paneli için özel olarak oluşturduğumuz API rotasını kullanıyoruz.
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

  // Bu fonksiyon, bir alt bileşendeki (Modal veya Table) işlemden sonra
  // veriyi yeniden çekmek için kullanılır.
  const handleDataChange = () => {
    fetchProducts();
  };
  
  const handleOpenNewModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEditModal = (product: CleanProduct) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-poppins font-bold">Ürün Yönetimi</h1>
        <button onClick={handleOpenNewModal} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          + Yeni Ürün Ekle
        </button>
      </div>
      
      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <p className="text-red-500">Hata: {error}</p>
      ) : (
        // Veriyi, düzenleme ve silme fonksiyonlarını prop olarak 'ProductsTable'a gönderiyoruz.
        <ProductsTable 
          products={products} 
          onEdit={handleOpenEditModal} 
          onDeleteSuccess={handleDataChange} 
        />
      )}
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        product={editingProduct}
        onSaveSuccess={handleDataChange} // Kaydetme başarılı olunca da veriyi yenile
      />
    </div>
  );
}