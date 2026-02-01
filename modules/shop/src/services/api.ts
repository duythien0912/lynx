/**
 * API Service - DummyJSON Adapter
 * Clean separation between UI and backend
 */

import { API_CONFIG } from '../utils/config.js';
import type { Product, ProductResponse, Category, CartAddPayload, CartAddResponse } from '../models/Product.js';
import type { User, LoginCredentials, LoginResponse } from '../models/User.js';

// API Error class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Base API client with fetch wrapper
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    config.signal = controller.signal;
    
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new APIError(
        errorData?.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return null as T;
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      throw new APIError(error.message);
    }
    throw new APIError('Unknown error occurred');
  }
}

/**
 * Product API
 */
export const ProductAPI = {
  /**
   * Get all products with pagination
   */
  getProducts: (skip = 0, limit = API_CONFIG.DEFAULT_LIMIT): Promise<ProductResponse> =>
    apiClient<ProductResponse>(`/products?skip=${skip}&limit=${limit}`),

  /**
   * Search products by keyword
   */
  searchProducts: (query: string, skip = 0, limit = API_CONFIG.DEFAULT_LIMIT): Promise<ProductResponse> =>
    apiClient<ProductResponse>(`/products/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`),

  /**
   * Get all categories
   */
  getCategories: (): Promise<string[]> =>
    apiClient<string[]>('/products/categories'),

  /**
   * Get products by category
   */
  getProductsByCategory: (category: string, skip = 0, limit = API_CONFIG.DEFAULT_LIMIT): Promise<ProductResponse> =>
    apiClient<ProductResponse>(`/products/category/${encodeURIComponent(category)}?skip=${skip}&limit=${limit}`),

  /**
   * Get single product by ID
   */
  getProduct: (id: number): Promise<Product> =>
    apiClient<Product>(`/products/${id}`),
};

/**
 * Auth API
 */
export const AuthAPI = {
  /**
   * Login with credentials
   */
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Get current user (requires token)
   */
  getCurrentUser: (token: string): Promise<User> =>
    apiClient<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string, expiresInMins = 60): Promise<LoginResponse> =>
    apiClient<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins }),
    }),
};

/**
 * Cart API
 */
export const CartAPI = {
  /**
   * Add items to cart
   */
  addToCart: (payload: CartAddPayload): Promise<CartAddResponse> =>
    apiClient<CartAddResponse>('/carts/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get user carts
   */
  getUserCarts: (userId: number): Promise<{ carts: unknown[] }> =>
    apiClient<{ carts: unknown[] }>(`/carts/user/${userId}`),
};

/**
 * User API
 */
export const UserAPI = {
  /**
   * Get all users
   */
  getUsers: (skip = 0, limit = 30): Promise<{ users: User[]; total: number; skip: number; limit: number }> =>
    apiClient(`/users?skip=${skip}&limit=${limit}`),

  /**
   * Get single user by ID
   */
  getUser: (id: number): Promise<User> =>
    apiClient<User>(`/users/${id}`),
};
