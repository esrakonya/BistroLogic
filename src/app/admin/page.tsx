// Dosya Yolu: src/app/admin/page.tsx
'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

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
    router.refresh();
  };

  return (
    // DEĞİŞİKLİK: Sayfa içeriği daha estetik bir kart içine alındı.
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <Cog6ToothIcon className="h-12 w-12 text-brand-red"/>
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Yönetim Paneline Hoş Geldiniz!</h1>
          {user && <p className="mt-1 text-gray-500">Giriş yapan kullanıcı: <strong>{user.email}</strong></p>}
        </div>
      </div>
      
      <p className="mt-6 text-gray-600">
        Sol taraftaki menüyü kullanarak ürünlerinizi ve site içeriklerinizi kolayca yönetebilirsiniz. 
        Yapacağınız değişiklikler anında web sitesine yansıyacaktır.
      </p>
      
      <button 
        onClick={handleLogout}
        className="mt-8 inline-flex items-center gap-2 bg-gray-700 hover:bg-brand-red text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
      >
        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
        Güvenli Çıkış Yap
      </button>
    </div>
  );
}