// Dosya Yolu: /src/app/api/featured-products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Force dynamic rendering to ensure that when an admin marks a product 
 * as "featured", it appears on the landing page immediately.
 */
export const dynamic = 'force-dynamic';

/**
 * Public API to fetch the "Handpicked" selection for the landing page.
 * Returns products marked as 'is_featured' and currently 'is_available'.
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)') // Fetching category metadata for the UI badges
      .eq('is_featured', true) 
      .eq('is_available', true) // Essential: Don't feature out-of-stock items
      .limit(8)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[Featured Products API Error]:", error);
      return NextResponse.json({ error: 'Failed to load featured selection.' }, { status: 500 });
    }

    /**
     * Data Cleaning: Flattening the category object for easier 
     * consumption by the frontend components.
     */
    const formattedData = data.map(product => ({
      ...product,
      categoryName: product.categories?.name || 'Gourmet',
      categories: undefined // Remove the nested object
    }));

    return NextResponse.json(formattedData);
    
  } catch (err: any) {
    console.error("[Fatal Featured API Error]:", err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}