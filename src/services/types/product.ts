export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category?: any; // O el tipo Category si lo tienes importado
  product_category_id?: number;
  available?: boolean | number;
  created_at?: string;
  updated_at?: string;
  
  // Permite propiedades extra como 'discount' si las usas visualmente
  discount?: number;
  price: number;        // viene como string desde API
  stock: number;
    // 0 | 1
  image_url: string | null; // id o path
  
  is_offer?: number | boolean | string; // Le damos flexibilidad (0, 1, true, "1")
  offer_price?: number | string;        // Puede venir como string de la API
  description: string;
}
