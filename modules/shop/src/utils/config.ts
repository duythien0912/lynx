/**
 * App Configuration
 * Easily switch between different API backends
 */

// API Configuration - Change this to switch backends
export const API_CONFIG = {
  // Base URL for DummyJSON API
  BASE_URL: 'https://dummyjson.com',
  
  // Timeout for API requests (ms)
  TIMEOUT: 10000,
  
  // Enable mock mode (offline fallback)
  MOCK_MODE: false,
  
  // Default pagination limit
  DEFAULT_LIMIT: 20,
};

// App Routes
export const ROUTES = {
  HOME: 'home',
  SEARCH: 'search',
  CATEGORY: 'category',
  PRODUCT_DETAIL: 'product_detail',
  CART: 'cart',
  PROFILE: 'profile',
  LOGIN: 'login',
  CHECKOUT: 'checkout',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'shop_user',
  TOKEN: 'shop_token',
  CART: 'shop_cart',
  LAST_SYNC: 'shop_last_sync',
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Animation durations
  ANIMATION_DURATION: 300,
  
  // Debounce delay for search
  SEARCH_DEBOUNCE: 300,
  
  // Image placeholder
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/300x300?text=No+Image',
};
