// Dosya Yolu: src/app/admin/page.tsx
'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

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
    router.refresh(); // Middleware'in devreye girmesi için refresh yeterli
  };

  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold">Admin Paneline Hoş Geldiniz!</h1>
      {user && <p className="mt-4">Giriş yapan kullanıcı: <strong>{user.email}</strong></p>}
      <p className="mt-2">Sol taraftaki menüyü kullanarak site içeriğini yönetebilirsiniz.</p>
      
      <button 
        onClick={handleLogout}
        className="mt-8 bg-brand-dark hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Çıkış Yap
      </button>
    </div>
  );
}