// Dosya Yolu: src/lib/types.ts

/**
 * Represents a refined product model used across the frontend.
 * This is the 'flattened' version of the database entity.
 */
export interface CleanProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number;
  categoryName: string | null; // Derived from joined Category table
  is_featured: boolean;        // Used for "Handpicked" section on landing page
  is_available: boolean;       // DEĞİŞİKLİK: Stok durumunu yönetmek için eklendi
  created_at?: string;         // Opsiyonel: Yeni ürün etiketleri için gerekebilir
}

/**
 * Represents a menu category.
 */
export interface Category {
  id: number;
  name: string;
  display_order?: number | null; // DEĞİŞİKLİK: Sıralama mantığı için eklendi
  products?: CleanProduct[];    // API'den kategorilerle birlikte ürünler gelirse diye
}

/**
 * Global site configuration and dynamic content keys.
 */
export interface SiteContent {
  id: number;
  key: string;        // e.g., 'footer_slogan', 'phone_number'
  value: string;      // The actual content string
  description: string; // Admin-facing hint for what this content does
}

/**
 * Represents the structure of a product ingredient.
 */
export interface Ingredient {
    id: number;
    name: string;
    is_allergen?: boolean;
}