// Bu, tüm bileşenlerin konuşacağı ortak dildir.
export interface CleanProduct {
    id: number;
    name: string;
    description: string | null;
    price: number;
    categoryName: string | null;
    category_id: number;
    image_url: string | null;
    is_featured: boolean;
  }
  
  export interface Category {
    id: number;
    name: string;
  }