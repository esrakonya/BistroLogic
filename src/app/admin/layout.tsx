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
  Squares2X2Icon,
  TagIcon
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

// 1. TAMAMEN İNGİLİZCE VE MODERN İSİMLENDİRMELER
const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: RectangleStackIcon },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Site Content', href: '/admin/content', icon: DocumentTextIcon },
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
    router.push('/login'); // Güvenli yönlendirme
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900">

      {/* --- SIDEBAR --- */}
      <aside className="w-72 flex-shrink-0 bg-neutral-950 text-neutral-400 flex flex-col shadow-2xl">
        
        {/* SERVELY BRANDING */}
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="group flex items-center gap-3 transition-all">
            <div className="bg-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Squares2X2Icon className="h-6 w-6 text-black stroke-2" />
            </div>
            <span className="text-white font-serif font-bold text-2xl tracking-tighter">
              Servely
            </span>
          </Link>
        </div>
        
        {/* NAVIGATION LINKS */}
        <nav className="flex-grow px-4 py-8 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon className={`h-5 w-5 mr-4 transition-colors ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} />
                <span className="font-medium tracking-tight text-sm uppercase">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT SECTION */}
        <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 p-2 rounded-full ring-2 ring-white/5">
                <UserCircleIcon className="h-6 w-6 text-neutral-400"/>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate uppercase tracking-widest">
                Admin Account
              </p>
              <p className="text-[11px] text-neutral-500 truncate" title={user?.email || ''}>
                {user ? user.email : 'Loading identity...'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-full mt-6 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-red-900/40 hover:text-red-400 text-neutral-300 text-xs font-bold py-3 rounded-xl transition-all duration-300 border border-white/5"
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Arka planda şık bir gradyan geçişi */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-neutral-200/50 to-transparent pointer-events-none -z-10"></div>
        
        <div className="max-w-[1400px] mx-auto py-12 px-8 md:px-16">
          {children}
        </div>
      </main>
    </div>
  );
}