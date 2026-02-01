// ============================================================================
// Domain Models - Generated from DummyJSON Schema
// ============================================================================

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  birthDate: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color: string;
    type: string;
  };
  domain?: string;
  ip?: string;
  address?: Address;
  bank?: Bank;
  company?: Company;
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: Crypto;
}

export interface Address {
  address: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  postalCode: string;
  state: string;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  address: Address;
  department: string;
  name: string;
  title: string;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface AddCartResponse {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface AddCartRequest {
  userId: number;
  products: {
    id: number;
    quantity: number;
  }[];
}

// ============================================================================
// App State Types
// ============================================================================

export type Screen = 
  | 'home' 
  | 'search' 
  | 'category' 
  | 'product-detail' 
  | 'cart' 
  | 'profile' 
  | 'login';

export interface AppState {
  // Navigation
  currentScreen: Screen;
  screenParams: Record<string, unknown>;
  
  // Products
  products: Product[];
  categories: string[];
  selectedCategory: string | null;
  currentProduct: Product | null;
  isLoadingProducts: boolean;
  productsError: string | null;
  hasMoreProducts: boolean;
  
  // Search
  searchQuery: string;
  searchResults: Product[];
  isSearching: boolean;
  
  // Cart
  cartItems: CartItem[];
  isCartLoading: boolean;
  
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  
  // Pagination
  skip: number;
  limit: number;
  totalProducts: number;
  
  // Offline mode
  isOffline: boolean;
  useMockData: boolean;
}

export const initialState: AppState = {
  currentScreen: 'home',
  screenParams: {},
  
  products: [],
  categories: [],
  selectedCategory: null,
  currentProduct: null,
  isLoadingProducts: false,
  productsError: null,
  hasMoreProducts: true,
  
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  
  cartItems: [],
  isCartLoading: false,
  
  user: null,
  token: null,
  isAuthenticated: false,
  isLoggingIn: false,
  loginError: null,
  
  skip: 0,
  limit: 10,
  totalProducts: 0,
  
  isOffline: false,
  useMockData: false,
};
