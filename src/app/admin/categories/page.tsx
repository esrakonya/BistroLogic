// Dosya Yolu: /src/app/admin/categories/page.tsx
'use client';

// Bu sayfa, ürünler sayfasıyla çok benzer bir yapıya sahip olacak.
// Şimdilik basit bir iskelet olarak düşünün.
// Gerçek işlevselliği (ekleme, silme, düzenleme) eklemek için
// CategoryTable ve CategoryModal gibi yeni bileşenler oluşturmamız gerekecek.

import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function CategoriesPage() {
  // TODO: Kategorileri çekme, modal'ı açma/kapama state'leri buraya eklenecek.
  // TODO: `CategoryTable` ve `CategoryModal` bileşenleri oluşturulup burada kullanılacak.

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Kategori Yönetimi</h1>
          <p className="mt-1 text-gray-500">Ürün kategorilerini yönetin.</p>
        </div>
        {/* TODO: Yeni kategori ekleme butonu ve modal açma fonksiyonu eklenecek */}
        <button className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg">
          + Yeni Kategori Ekle
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="text-center py-12 text-gray-500">
           <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin"/>
           <p className="mt-4 font-semibold">Kategori Yönetimi Özelliği Yapım Aşamasında...</p>
           <p className="mt-1 text-sm">Bu bölümde kategorilerinizi listeleyebilecek, yeni kategoriler ekleyebilecek ve mevcut olanları düzenleyebileceksiniz.</p>
        </div>
      </div>
    </div>
  );
}