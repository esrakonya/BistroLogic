// Dosya Yolu: /src/lib/data.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from 'react';
// DEĞİŞİKLİK 1: Yanlış tarif yerine, merkezi ve doğru olan tipi import ediyoruz.
import type { SiteContent } from './types'; 

// DEĞİŞİKLİK 2: Yanlış olan 'SiteContent' arayüzü buradan tamamen SİLİNDİ.

// site_content tablosundan tüm veriyi çeken ve önbellekleyen fonksiyon.
// Fonksiyonun döndürdüğü verinin tipini, import ettiğimiz doğru tiple eşleştiriyoruz.
export const getSiteContent = cache(async (): Promise<SiteContent[]> => {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('site_content')
    .select('*'); // '*' ile tüm sütunları (id, key, value, description) çeker.

  if (error) {
    console.error('Error fetching site content:', error.message);
    return [];
  }

  return data || [];
});