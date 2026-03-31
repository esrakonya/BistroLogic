// Dosya Yolu: /src/app/api/admin/products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Lists all products with their associated category names (GET).
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Joining products with categories to fetch specific metadata
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('id', { ascending: false }); // Newest products first for admin convenience

    if (error) throw error;

    /**
     * Data Flattening: Transforming the nested Supabase response 
     * into a clean, flat object for easier frontend consumption.
     */
    const formattedData = data.map(p => ({ 
      ...p, 
      categoryName: p.categories?.name || 'Uncategorized', 
      categories: undefined 
    }));

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Creates a new product in the inventory (POST).
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const productData = await request.json();

    // Basic server-side validation
    if (!productData || !productData.name) {
      return NextResponse.json({ error: 'Product details are missing.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) throw error;
    
    // Invalidate paths to keep data consistent across the platform
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}