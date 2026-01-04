export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  
  price: string;        // viene como string desde API
  stock: number;
  is_offer: number;     // 0 | 1
  image: string | null; // id o path
  category: Category;
}
