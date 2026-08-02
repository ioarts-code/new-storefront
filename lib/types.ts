export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  author?: string | null;
  copyright?: string | null;
  productType?: string | null;
  heroImage?: ProductImage | null;
  download?: {
    url: string;
    fileName?: string;
  } | null;
  categories?: Category[];
  tags?: Tag[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  collections?: Collection[];
  orderItems?: OrderItem[];
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  fileName?: string;
}

export interface ProductVariant {
  id: string;
  [key: string]: any;
}

export interface Review {
  id: string;
  [key: string]: any;
}

export interface Collection {
  id: string;
  name: string;
  slug?: string;
}

export interface OrderItem {
  id: string;
  [key: string]: any;
}

export interface ProductsResponse {
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
