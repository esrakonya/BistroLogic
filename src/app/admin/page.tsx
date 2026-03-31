// Dosya Yolu: src/app/admin/page.tsx
'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { 
  ArrowRightStartOnRectangleIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  CubeIcon, 
  GlobeAltIcon 
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- WELCOME BANNER --- */}
      <section className="relative overflow-hidden bg-neutral-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <SparklesIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/80">System Online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
          </h1>
          <p className="text-neutral-400 text-lg font-light leading-relaxed">
            Your gourmet ecosystem is running smoothly. Use the management tools to update your menu and business configuration in real-time.
          </p>
          <div className="flex gap-4 pt-4">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1 text-center">
                <span className="block text-2xl font-bold">Live</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Sync Status</span>
             </div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1 text-center">
                <span className="block text-2xl font-bold">v1.4</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Platform Version</span>
             </div>
          </div>
        </div>
        
        {/* Dekoratif arka plan elemanı */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neutral-800/50 to-transparent pointer-events-none"></div>
      </section>

      {/* --- QUICK ACTIONS / SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group">
           <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CubeIcon className="h-6 w-6" />
           </div>
           <h3 className="text-xl font-bold text-neutral-900">Inventory</h3>
           <p className="text-neutral-500 text-sm mt-2">Manage products, pricing, and availability across all categories.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group">
           <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ChartBarIcon className="h-6 w-6" />
           </div>
           <h3 className="text-xl font-bold text-neutral-900">Architecture</h3>
           <p className="text-neutral-500 text-sm mt-2">Your system is built with Next.js 14 and Supabase Cloud Engine.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group">
           <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GlobeAltIcon className="h-6 w-6" />
           </div>
           <h3 className="text-xl font-bold text-neutral-900">Global Reach</h3>
           <p className="text-neutral-500 text-sm mt-2">Industry-agnostic design ready for any food-service business.</p>
        </div>

      </div>

      {/* --- ACCOUNT INFO --- */}
      <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-3xl border border-dashed border-neutral-300">
        <div className="text-center md:text-left">
          <p className="text-sm text-neutral-400 font-medium uppercase tracking-widest">Active Session</p>
          <p className="text-lg font-semibold text-neutral-900 mt-1">{user?.email}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-6 md:mt-0 flex items-center gap-3 bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-600 font-bold py-3 px-8 rounded-2xl transition-all active:scale-95"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          End Session
        </button>
      </div>

    </div>
  );
}