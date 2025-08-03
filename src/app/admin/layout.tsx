// Dosya Yolu: /src/app/admin/layout.tsx
'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

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
  const pathname = usePathname(); 
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    // DEĞİŞİKLİK: Arka plan rengi daha yumuşak bir gri (bg-gray-50) olarak güncellendi.
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* --- YAN MENÜ (SIDEBAR) --- */}
      {/* DEĞİŞİKLİK: Sidebar arka planı, ana temayla uyumlu 'brand-dark' yerine daha koyu bir 'gray-800' oldu.
          Bu, panelin siteden farklı bir 'yönetim aracı' olduğunu hissettirir. */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-gray-300 flex flex-col shadow-lg">
        {/* Logo Alanı */}
        <div className="h-20 flex items-center justify-center border-b border-gray-700/50">
          <Link href="/" className="text-white font-poppins font-bold text-xl tracking-wider hover:opacity-80 transition-opacity">
            PİDE<span className="text-brand-yellow">EFSANESİ</span>
          </Link>
        </div>
        
        {/* Menü Linkleri */}
        <nav className="flex-grow px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-brand-red text-white shadow-inner' // Aktif link stili daha belirgin
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                <link.icon className="h-6 w-6 mr-4" />
                <span className="font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Kullanıcı Alanı */}
        <div className="border-t border-gray-700/50 p-4">
          <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-gray-500"/>
            <div className="ml-3">
              <p className="text-sm font-medium text-white truncate" title={user?.email || ''}>
                {user ? user.email : 'Yükleniyor...'}
              </p>
              <button 
                onClick={handleLogout} 
                className="group flex items-center text-xs text-gray-400 hover:text-brand-red transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-1.5 transition-transform group-hover:translate-x-1" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      {/* DEĞİŞİKLİK: İçerik alanı, bir 'container' içine alınarak daha düzenli hale getirildi. */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-10 px-6 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}