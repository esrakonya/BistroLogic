// Dosya Yolu: src/app/api/admin/categoriess/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Bu rota, sunucu tarafında her zaman dinamik olarak çalışmalı.
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Ortam değişkenlerinin varlığını kontrol ediyoruz.
  if (!supabaseUrl || !serviceKey) {
    console.error("Supabase URL veya Service Key .env.local dosyasında eksik!");
    return NextResponse.json({ error: "Sunucu tarafında konfigürasyon hatası var." }, { status: 500 });
  }

  // RLS'i atlamak için SERVICE_ROLE_KEY ile "Süper Admin" istemcisi oluşturuyoruz.
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Veritabanından tüm kategorileri, 'display_order'a göre sıralayarak çekiyoruz.
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('display_order', { ascending: true });

    // Eğer Supabase bir hata döndürürse, bunu loglayıp hata yanıtı gönderiyoruz.
    if (error) {
      console.error("Supabase'den kategoriler çekilirken hata oluştu:", error);
      return NextResponse.json({ error: "Veritabanı sorgu hatası.", details: error.message }, { status: 500 });
    }

    // Her şey yolundaysa, kategori verisini döndürüyoruz.
    return NextResponse.json(data);

  } catch (err: any) {
    // Beklenmedik bir hata olursa bunu yakalıyoruz.
    console.error("API rotasında (/api/categories) genel bir hata oluştu:", err);
    return NextResponse.json({ error: 'Sunucuda beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}