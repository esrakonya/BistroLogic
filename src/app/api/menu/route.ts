// Dosya Yolu: /src/app/api/menu/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Public API to fetch the complete menu structure.
 * Performs a deep join: Categories -> Products -> Ingredients
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

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
      console.error("[Menu API Error]:", error);
      return NextResponse.json({ error: 'Failed to synchronize with the database.' }, { status: 500 });
    }

    /**
     * DATA OPTIMIZATION: 
     * We transform the deeply nested Supabase join response into a 
     * clean, developer-friendly JSON structure for the frontend.
     */
    const cleanedData = data.map(category => ({
      id: category.id,
      name: category.name,
      products: (category.products || [])
        .filter((p: any) => p.is_available) // Only show available products to customers
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          // Flattening ingredients array: [{ingredients: {name: 'Meat'}}] -> ['Meat']
          ingredients: product.product_ingredients?.map((pi: any) => pi.ingredients?.name).filter(Boolean) || []
        }))
    }));

    return NextResponse.json(cleanedData);

  } catch (err: any) {
    console.error("[Fatal Menu API Error]:", err);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching the menu.' }, { status: 500 });
  }
}