// Dosya Yolu: /src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryModal from '@/components/admin/CategoryModal';
import { PlusIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import type { Category } from '@/lib/types';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/categories?v=${new Date().getTime()}`, { 
        credentials: 'include' 
      });
      if (!res.ok) throw new Error('Failed to fetch categories.');
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
    <main className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <Squares2X2Icon className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-neutral-900">Menu Categories</h1>
          <p className="text-neutral-500 font-light">Organize and manage your product categories efficiently.</p>
        </div>

        <button 
          onClick={handleOpenNewModal} 
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-xl hover:shadow-neutral-200 active:scale-95"
        >
          <PlusIcon className="h-5 w-5 stroke-2" />
          Add New Category
        </button>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8">
            <TableSkeleton rows={5} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 tracking-tight">{error}</h3>
            <button onClick={fetchCategories} className="mt-4 text-sm font-bold text-neutral-900 underline underline-offset-4">Try Again</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <CategoryTable
              categories={categories}
              onEdit={handleOpenEditModal}
              onDeleteSuccess={handleDataChange}
            />
          </div>
        )}
      </div>
      
      {/* --- MODAL LAYER --- */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onSaveSuccess={handleDataChange}
      />
    </main>
  );
}