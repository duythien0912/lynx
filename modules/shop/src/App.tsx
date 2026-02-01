/**
 * Shop MiniApp - E-commerce Demo
 * 
 * Architecture:
 * - UI Layer: Pure DSL components (screens/*)
 * - State Layer: createStore() hook
 * - Service Layer: DummyJSON API adapter
 * 
 * Features:
 * - Product browsing with pagination
 * - Category filtering
 * - Search functionality
 * - Product details with gallery
 * - Shopping cart management
 * - User authentication
 * - Mock/offline mode support
 */

import { useState, useEffect } from '@lynx-js/react';
import './App.css';

// Store
import { createStore } from './store/index.js';

// Screens
import {
  HomeScreen,
  SearchScreen,
  ProductDetailScreen,
  CartScreen,
  ProfileScreen,
  LoginScreen,
} from './screens/index.js';

// Route type
type Route = 
  | { name: 'home' }
  | { name: 'search' }
  | { name: 'category'; params: { category: string } }
  | { name: 'product_detail'; params: { product?: unknown } }
  | { name: 'cart' }
  | { name: 'profile' }
  | { name: 'login'; params?: { returnTo?: string } }
  | { name: 'checkout' };

export function App(props: { onRender?: () => void }) {
  // Initialize store
  const store = createStore();
  
  // Navigation state
  const [currentRoute, setCurrentRoute] = useState<Route>({ name: 'home' });
  const [routeHistory, setRouteHistory] = useState<Route[]>([{ name: 'home' }]);

  // Trigger onRender callback
  useEffect(() => {
    props.onRender?.();
  }, []);

  // Navigation handler
  const navigate = (screenName: string, params?: unknown) => {
    const newRoute: Route = (() => {
      switch (screenName) {
        case 'home':
          return { name: 'home' };
        case 'search':
          return { name: 'search' };
        case 'category':
          return { name: 'category', params: params as { category: string } };
        case 'product_detail':
          return { name: 'product_detail', params: params as { product?: unknown } };
        case 'cart':
          return { name: 'cart' };
        case 'profile':
          return { name: 'profile' };
        case 'login':
          return { name: 'login', params: params as { returnTo?: string } | undefined };
        case 'checkout':
          return { name: 'checkout' };
        default:
          return { name: 'home' };
      }
    })();

    setRouteHistory(prev => [...prev, newRoute]);
    setCurrentRoute(newRoute);
  };

  // Back navigation
  const goBack = () => {
    setRouteHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentRoute(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  };

  // Render current screen based on route
  const renderScreen = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomeScreen store={store} onNavigate={navigate} />;
      
      case 'search':
        return (
          <SearchScreen 
            store={store} 
            onNavigate={navigate} 
            onBack={goBack} 
          />
        );
      
      case 'product_detail':
        return (
          <ProductDetailScreen 
            store={store} 
            onNavigate={navigate} 
            onBack={goBack} 
          />
        );
      
      case 'cart':
        return (
          <CartScreen 
            store={store} 
            onNavigate={navigate} 
            onBack={goBack} 
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen 
            store={store} 
            onNavigate={navigate} 
            onBack={goBack} 
          />
        );
      
      case 'login':
        return (
          <LoginScreen 
            store={store} 
            onNavigate={navigate} 
            onBack={goBack}
            returnTo={currentRoute.params?.returnTo}
          />
        );
      
      default:
        return <HomeScreen store={store} onNavigate={navigate} />;
    }
  };

  return (
    <view className='AppContainer'>
      {renderScreen()}
    </view>
  );
}
