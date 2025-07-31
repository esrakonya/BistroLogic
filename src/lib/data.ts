// Dosya Yolu: src/lib/data.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from 'react';

// site_content tablosundaki bir satırın tipini tanımlıyoruz.
export interface SiteContent {
  id: number;
  key: string;
  value: string;
  description: string;
}

// React'in 'cache' fonksiyonu, aynı render döngüsü içinde bu fonksiyonun
// birden çok kez çağrılması durumunda veritabanına sadece bir kez gitmesini sağlar.
// Bu bir performans optimizasyonudur.
export const getSiteContent = cache(async (): Promise<SiteContent[]> => {
  const cookieStore = cookies();
  // Sunucu tarafında, anonim de olsa bir istemci oluşturuyoruz.
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    // site_content tablosu için "herkese açık okuma" politikası yazmamız gerekecek.
    const { data, error } = await supabase.from('site_content').select('*');
    if (error) {
      console.error("Site content fetch error:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch site content:", error);
    return [];
  }
});