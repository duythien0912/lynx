/**
 * Storage Utility - Lynx-compatible storage
 * Uses memory storage for cross-platform compatibility
 */

import { STORAGE_KEYS } from './config.js';

// Simple memory storage
const memoryStorage: Record<string, string> = {};

/**
 * Get storage API - uses memory storage for Lynx compatibility
 */
function getStorage() {
  // Use memory storage for all platforms
  // Lynx doesn't expose synchronous storage APIs
  return {
    get: (key: string): string | null => memoryStorage[key] || null,
    set: (key: string, value: string): void => { memoryStorage[key] = value; },
    remove: (key: string): void => { delete memoryStorage[key]; },
    clear: (): void => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); },
  };
}

const storage = getStorage();

export const Storage = {
  get: <T>(key: string): T | null => {
    const value = storage.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },
  
  remove: (key: string): void => {
    storage.remove(key);
  },
  
  clear: (): void => {
    storage.clear();
  },
  
  // Helper methods for common keys
  getUser: () => Storage.get(STORAGE_KEYS.USER),
  setUser: (user: unknown) => Storage.set(STORAGE_KEYS.USER, user),
  removeUser: () => Storage.remove(STORAGE_KEYS.USER),
  
  getToken: () => Storage.get<string>(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => Storage.set(STORAGE_KEYS.TOKEN, token),
  removeToken: () => Storage.remove(STORAGE_KEYS.TOKEN),
  
  getCart: () => Storage.get(STORAGE_KEYS.CART),
  setCart: (cart: unknown) => Storage.set(STORAGE_KEYS.CART, cart),
  removeCart: () => Storage.remove(STORAGE_KEYS.CART),
};
