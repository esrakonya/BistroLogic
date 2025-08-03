// Dosya Yolu: src/lib/data.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from 'react';

// YENİ: `export` kelimesi eklendi.
// Artık bu tip, projenin başka yerlerinden import edilebilir.
export interface SiteContent {
  id: number;
  created_at: string;
  site_title: string | null;
  footer_about: string | null;
  footer_contact_address: string | null;
  footer_contact_phone: string | null;
  footer_contact_email: string | null;
  // Diğer tüm alanları buraya eklediğinden emin ol...
}

// site_content tablosundan tüm veriyi çeken ve önbellekleyen fonksiyon.
// 'cache' kullanımı, aynı render işlemi içinde bu fonksiyon kaç kez çağrılırsa çağrılsın
// veritabanına sadece bir kez gidilmesini sağlar.
export const getSiteContent = cache(async (): Promise<SiteContent[]> => {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('site_content')
    .select('*');

  if (error) {
    console.error('Error fetching site content:', error.message);
    return []; // Hata durumunda boş dizi döndür.
  }

  return data || []; // Veri null ise boş dizi döndür.
});