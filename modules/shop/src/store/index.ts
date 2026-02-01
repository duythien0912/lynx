/**
 * Global State Management
 * Clean separation of state from UI
 */

import { useState, useCallback, useEffect } from '@lynx-js/react';
import type { Product, Cart, CartItem } from '../models/Product.js';
import type { User, AuthState } from '../models/User.js';
import { Storage } from '../utils/storage.js';
import { API_CONFIG } from '../utils/config.js';
import { ProductAPI, AuthAPI, UserAPI } from '../services/api.js';
import { MockData } from '../mocks/data.js';

// ============================================
// Types
// ============================================

export interface AppState {
  // Products
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  currentCategory: string | null;
  selectedProduct: Product | null;
  isLoadingProducts: boolean;
  productsError: string | null;
  hasMoreProducts: boolean;
  
  // Search
  searchQuery: string;
  searchResults: Product[];
  isSearching: boolean;
  
  // Cart
  cart: Cart;
  
  // Auth
  auth: AuthState;
  
  // Pagination
  skip: number;
  limit: number;
}

// ============================================
// Initial State
// ============================================

const createInitialCart = (): Cart => ({
  items: [],
  total: 0,
  count: 0,
});

const createInitialAuth = (): AuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

// ============================================
// Helper Functions
// ============================================

function calculateCartTotals(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);
  
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    total: Math.round(total * 100) / 100,
    count,
  };
}

// ============================================
// Store Factory
// ============================================

export function createStore() {
  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<Cart>(createInitialCart());
  
  // Auth State
  const [auth, setAuth] = useState<AuthState>(createInitialAuth());
  
  // Pagination State
  const [skip, setSkip] = useState(0);
  const limit = API_CONFIG.DEFAULT_LIMIT;

  // ==========================================
  // Load persisted data on mount
  // ==========================================
  useEffect(() => {
    // Load cart
    const savedCart = Storage.getCart();
    if (savedCart) {
      setCart(savedCart as Cart);
    }
    
    // Load auth
    const savedUser = Storage.getUser();
    const savedToken = Storage.getToken();
    if (savedUser && savedToken) {
      setAuth({
        user: savedUser as User,
        token: savedToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // ==========================================
  // Product Actions
  // ==========================================

  const fetchProducts = useCallback(async (reset = false) => {
    setIsLoadingProducts(true);
    setProductsError(null);
    
    try {
      const newSkip = reset ? 0 : skip;
      
      if (API_CONFIG.MOCK_MODE) {
        // Use mock data
        const mockProducts = reset 
          ? MockData.products.slice(0, limit)
          : [...products, ...MockData.products.slice(skip, skip + limit)];
        setProducts(mockProducts);
        setHasMoreProducts(skip + limit < MockData.products.length);
        if (reset) setSkip(limit);
        else setSkip(newSkip + limit);
      } else {
        // Use real API
        const response = await ProductAPI.getProducts(newSkip, limit);
        
        if (reset) {
          setProducts(response.products);
          setSkip(response.limit);
        } else {
          setProducts(prev => [...prev, ...response.products]);
          setSkip(newSkip + response.limit);
        }
        
        setHasMoreProducts(response.total > newSkip + response.products.length);
      }
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [skip, limit, products]);

  const fetchCategories = useCallback(async () => {
    try {
      if (API_CONFIG.MOCK_MODE) {
        setCategories(MockData.categories);
      } else {
        const cats = await ProductAPI.getCategories();
        setCategories(cats);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category: string) => {
    setIsLoadingProducts(true);
    setProductsError(null);
    setCurrentCategory(category);
    
    try {
      if (API_CONFIG.MOCK_MODE) {
        const mockProducts = MockData.products.filter(p => p.category === category);
        setProducts(mockProducts);
        setHasMoreProducts(false);
      } else {
        const response = await ProductAPI.getProductsByCategory(category, 0, 100);
        setProducts(response.products);
        setHasMoreProducts(false);
      }
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'Failed to fetch category products');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      if (API_CONFIG.MOCK_MODE) {
        const results = MockData.products.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      } else {
        const response = await ProductAPI.searchProducts(query);
        setSearchResults(response.products);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const selectProduct = useCallback((product: Product | null) => {
    setSelectedProduct(product);
  }, []);

  // ==========================================
  // Cart Actions
  // ==========================================

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev.items, { product, quantity }];
      }
      
      const newCart = calculateCartTotals(newItems);
      Storage.setCart(newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.product.id !== productId);
      const newCart = calculateCartTotals(newItems);
      Storage.setCart(newCart);
      return newCart;
    });
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => {
      const newItems = prev.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      const newCart = calculateCartTotals(newItems);
      Storage.setCart(newCart);
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    const newCart = createInitialCart();
    setCart(newCart);
    Storage.removeCart();
  }, []);

  // ==========================================
  // Auth Actions
  // ==========================================

  const login = useCallback(async (username: string, password: string) => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let userData: User;
      let tokenData: string;
      
      if (API_CONFIG.MOCK_MODE) {
        // Mock login
        const mockUser = MockData.users.find(u => u.username === username);
        if (!mockUser || password !== 'password') {
          throw new Error('Invalid credentials');
        }
        userData = mockUser;
        tokenData = 'mock-token-' + Date.now();
      } else {
        const response = await AuthAPI.login({
          username,
          password,
          expiresInMins: 60,
        });
        
        // Fetch full user details
        const user = await UserAPI.getUser(response.id);
        userData = user;
        tokenData = response.token;
      }
      
      const newAuth: AuthState = {
        user: userData,
        token: tokenData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      setAuth(newAuth);
      Storage.setUser(userData);
      Storage.setToken(tokenData);
      
      return true;
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(createInitialAuth());
    Storage.removeUser();
    Storage.removeToken();
  }, []);

  // ==========================================
  // Checkout Action
  // ==========================================

  const checkout = useCallback(async (): Promise<boolean> => {
    if (!auth.isAuthenticated || !auth.user) {
      return false;
    }
    
    try {
      // Simulate checkout API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful checkout
      clearCart();
      return true;
    } catch (error) {
      console.error('Checkout failed:', error);
      return false;
    }
  }, [auth.isAuthenticated, auth.user, clearCart]);

  // ==========================================
  // Reset Actions
  // ==========================================

  const resetProducts = useCallback(() => {
    setProducts([]);
    setSkip(0);
    setHasMoreProducts(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // ==========================================
  // Return Store
  // ==========================================

  return {
    // State
    products,
    featuredProducts,
    categories,
    currentCategory,
    selectedProduct,
    isLoadingProducts,
    productsError,
    hasMoreProducts,
    searchQuery,
    searchResults,
    isSearching,
    cart,
    auth,
    skip,
    limit,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    searchProducts,
    selectProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    login,
    logout,
    checkout,
    resetProducts,
    clearSearch,
  };
}

// Type for the store
export type Store = ReturnType<typeof createStore>;
