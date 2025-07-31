// Dosya Yolu: src/app/admin/layout.tsx
'use client'; // usePathname hook'unu kullanmak için bu gerekli

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'; // Outline (ince) ikonlar daha zarif durur
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Admin menüsündeki her bir linkin yapısını tanımlayan tip
type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// Menü linklerimizi bir dizi olarak tanımlıyoruz. Bu, yeni linkler eklemeyi kolaylaştırır.
const navLinks: NavLink[] = [
  { name: 'Ana Panel', href: '/admin', icon: HomeIcon },
  { name: 'Ürün Yönetimi', href: '/admin/products', icon: RectangleStackIcon },
  { name: 'İçerik Yönetimi', href: '/admin/content', icon: DocumentTextIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // O anki aktif yolu (URL) almamızı sağlar
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Kullanıcı bilgisini almak için
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sol Taraftaki Yan Menü (Sidebar) */}
      <aside className="w-64 flex-shrink-0 bg-brand-dark text-gray-300 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <Link href="/" className="text-white font-poppins font-bold text-xl tracking-wider">
            PİDE<span className="text-brand-yellow">EFSANESİ</span>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 py-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-brand-red text-white' // Aktif linkin stili
                    : 'hover:bg-gray-700 hover:text-white' // Normal linkin stili
                }`}
              >
                <link.icon className="h-6 w-6 mr-3" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Kullanıcı Bilgileri ve Çıkış Butonu */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-gray-400"/>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user ? user.email : 'Yükleniyor...'}
              </p>
              <button 
                onClick={handleLogout} 
                className="flex items-center text-xs text-gray-400 hover:text-brand-yellow"
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-1" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sağ Taraftaki Ana İçerik Alanı */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}