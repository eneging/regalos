export type Tool = {
  name: string;
  slug: string;
  category: string;
  description: string;
  website: string;
  logo?: string;
  image?: string;
  tutorialVideo?: string;
  screenshots?: string[];
  pricing?: {
    plan: string;
    price: string;
    features: string[];
  }[];
  rating?: number;
  reviews?: {
    user: string;
    comment: string;
    rating: number;
  }[];
  tags?: string[];
  pros?: string[];
  cons?: string[];
  releaseDate?: string;
  developer?: string;

  // 🔥 Nuevos campos
  courses?: {
    title: string;
    url: string;
    platform: string;
    price?: string;
    affiliate?: string; // enlace afiliado
  }[];

  youtubeChannels?: {
    name: string;
    url: string;
    language?: string;
  }[];

  creators?: {
    name: string;
    platform: string; // YouTube, Blog, Twitter
    url: string;
  }[];

  docs?: string;
  tutorials?: { title: string; url: string }[];

  affiliateLink?: string;
  deals?: { description: string; url: string; validUntil?: string }[];

  platforms?: string[];
  integrations?: string[];
  alternatives?: string[];
  requirements?: string[];

  communityLinks?: { name: string; url: string }[];
  faq?: { question: string; answer: string }[];
};




// src/types.ts
export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_offer: boolean;
  offer_price?: number;
  category: Category;  
               // objeto Category completo
  available: boolean;
  created_at: string;
  updated_at: string;
   product_category_id: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  phone?: string;
  address?: string;
  dni_or_ruc?: string;
  profile_image?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  is_active?: boolean;
}



export interface Category {
  id: number;
  name: string;
}

// Para el formulario, permitimos que la imagen sea un archivo o una URL
export type ProductFormData = Omit<Product, "id"> & {
  image_url: File | string | null;
};

// Para el payload que se envía al backend
export type ProductPayload = Omit<Product, "id" | "image_url"> & {
  image_url?: string;
};