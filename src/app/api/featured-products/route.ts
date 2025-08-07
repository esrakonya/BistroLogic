// Dosya Yolu: /src/app/api/featured-products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Bu rota, admin panelinde bir ürün "öne çıkarılan" olarak işaretlendiğinde
// anında güncellenmesi için dinamik olmalıdır.
export const dynamic = 'force-dynamic';

export async function GET() {
  // Müşteri tarafı olduğu için anonim anahtarı kullanır ve RLS kurallarına uyar.
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true) // Sadece 'is_featured' değeri true olanları getir.
      .limit(8); // Ana sayfada en fazla 8 tane gösterelim.

    if (error) throw error;

    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}