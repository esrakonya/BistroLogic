// Dosya Yolu: src/app/api/menu/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Değişken adını doğru hale getirdik.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Sunucu konfigürasyon hatası." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        products (
          id,
          name,
          description,
          price,
          is_available,
          image_url,
          product_ingredients (
            ingredients ( name )
          )
        )
      `)
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Supabase API Hatası (/api/menu):", error);
      return NextResponse.json({ error: "Veritabanı sorgu hatası.", details: error.message }, { status: 500 });
    }

    // ----- VERİ TEMİZLEME İŞLEMİNİN DOĞRU HALİ -----
    // Supabase'den gelen karmaşık veriyi, arayüzün kolayca kullanabileceği bir formata dönüştürüyoruz.
    const cleanedData = data.map(category => ({
      id: category.id,
      name: category.name,
      products: category.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        is_available: product.is_available,
        image_url: product.image_url,
        // İç içe geçmiş 'product_ingredients' ve 'ingredients' yapısını,
        // basit bir string dizisine ('ingredients: ["Kıyma", "Domates"]') dönüştürüyoruz.
        ingredients: product.product_ingredients.map((pi: any) => pi.ingredients.name)
      }))
    }));
    // -----------------------------------------------

    // Temizlenmiş veriyi arayüze gönderiyoruz.
    return NextResponse.json(cleanedData);

  } catch (err: any) {
    console.error("API rotasında genel bir hata oluştu:", err);
    return NextResponse.json({ error: 'Sunucuda beklenmedik bir hata oluştu.', details: err.message }, { status: 500 });
  }
}