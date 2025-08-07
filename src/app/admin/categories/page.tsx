// Dosya Yolu: /src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryModal from '@/components/admin/CategoryModal';
import { PlusIcon } from '@heroicons/react/24/solid';
import type { Category } from '@/lib/types';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    // setLoading(true); // Yenileme sırasında tam ekran yükleme olmasın diye kapatılabilir
    try {
      const res = await fetch(`/api/admin/categories?v=${new Date().getTime()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Kategoriler çekilemedi.');
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDataChange = () => { fetchCategories(); };
  const handleOpenNewModal = () => { setEditingCategory(null); setIsModalOpen(true); };
  const handleOpenEditModal = (category: Category) => { setEditingCategory(category); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingCategory(null); };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Kategori Yönetimi</h1>
          <p className="mt-1 text-gray-500">Ürün kategorilerini yönetin.</p>
        </div>
        <button onClick={handleOpenNewModal} className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
          <PlusIcon className="h-5 w-5" />
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <TableSkeleton rows={3} />
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={handleOpenEditModal}
            onDeleteSuccess={handleDataChange}
          />
        )}
      </div>
      
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onSaveSuccess={handleDataChange}
      />
    </div>
  );
}