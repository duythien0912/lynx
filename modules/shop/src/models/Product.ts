/**
 * Product Model - Generated from DummyJSON Schema
 * https://dummyjson.com/docs/products
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface CartAddPayload {
  userId: number;
  products: { id: number; quantity: number }[];
}

export interface CartAddResponse {
  id: number;
  products: { id: number; title: string; price: number; quantity: number; total: number; discountPercentage: number; discountedTotal: number; thumbnail: string }[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
