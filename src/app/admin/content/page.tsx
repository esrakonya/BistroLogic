// Dosya Yolu: /src/app/admin/content/page.tsx
'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import TableSkeleton from '@/components/skeletons/TableSkeleton'; // Skeleton'ı da import edelim

interface SiteContent {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // DEĞİŞİKLİK: Kimlik doğrulama için 'credentials: include' eklendi.
      const res = await fetch('/api/admin/content', { 
        cache: 'no-store',
        credentials: 'include' 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'İçerik verisi alınamadı.');
      }
      const data = await res.json();
      setContents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleInputChange = (key: string, value: string) => {
    setContents(currentContents =>
      currentContents.map(c => (c.key === key ? { ...c, value } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // DEĞİŞİKLİK: Kimlik doğrulama için 'credentials: include' eklendi.
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contents),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setSuccess('Değişiklikler başarıyla kaydedildi!');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Bir hata oluştu.');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Yükleme durumu için daha iyi bir iskelet gösterimi
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Site İçerik Yönetimi</h1>
          <p className="mt-1 text-gray-500">Web sitesinde görünen metinleri ve bilgileri buradan güncelleyin.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Site İçerik Yönetimi</h1>
        <p className="mt-1 text-gray-500">Web sitesinde görünen metinleri ve bilgileri buradan güncelleyin.</p>
      </div>
      
      <div className="fixed top-5 right-5 z-50 w-80">
        <Transition
          show={!!success}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="p-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6"/>
            <p className="font-semibold">{success}</p>
          </div>
        </Transition>
        <Transition
          show={!!error}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="p-4 bg-red-500 text-white rounded-lg shadow-lg flex items-center gap-3">
            <XCircleIcon className="h-6 w-6"/>
            <p className="font-semibold">{error}</p>
          </div>
        </Transition>
      </div>
      
      {/* Hata mesajını formun üstünde göstermek daha iyi olabilir. */}
      {error && !success && (
         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
           <p className="font-bold">Bir Hata Oluştu</p>
           <p>{error}</p>
         </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
        {contents.map(content => (
          <div key={content.key}>
            <label htmlFor={content.key} className="block text-gray-800 font-semibold mb-2">
              {content.description || content.key}
            </label>
            {/* Form alanlarının 'textarea' veya 'input' olup olmadığına karar veren mantık */}
            {content.value.length > 50 || content.value.includes('\n') || content.key.includes('text') || content.key.includes('address') ? (
              <textarea
                id={content.key}
                value={content.value}
                onChange={e => handleInputChange(content.key, e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition"
              />
            ) : (
              <input
                type="text"
                id={content.key}
                value={content.value}
                onChange={e => handleInputChange(content.key, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition"
              />
            )}
          </div>
        ))}
        
        <div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}