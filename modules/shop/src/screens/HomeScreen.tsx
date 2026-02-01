/**
 * Home Screen - Redesigned
 * Improved visual hierarchy, spacing, and friction reduction
 */

import { useEffect } from '@lynx-js/react';
import type { Product } from '../models/Product.js';
import type { Store } from '../store/index.js';
import './HomeScreen.css';

interface HomeScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
}

// Icon Components (using emojis and text)
const SearchIcon = () => (
  <text className="icon-svg">🔍</text>
);

const CartIcon = ({ count }: { count: number }) => (
  <view className="cart-icon-wrapper">
    <text className="icon-svg">🛒</text>
    {count > 0 && (
      <view className="cart-badge">
        <text className="cart-badge-text">{count > 99 ? '99+' : count}</text>
      </view>
    )}
  </view>
);

const UserIcon = () => (
  <text className="icon-svg">👤</text>
);

const StarIcon = () => (
  <text className="star-icon-svg">⭐</text>
);

const ChevronRightIcon = () => (
  <text className="chevron-icon">›</text>
);

export function HomeScreen({ store, onNavigate }: HomeScreenProps) {
  const {
    products,
    categories,
    currentCategory,
    isLoadingProducts,
    hasMoreProducts,
    cart,
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    addToCart,
    selectProduct,
  } = store;

  useEffect(() => {
    fetchCategories();
    fetchProducts(true);
  }, []);

  const handleProductPress = (product: Product) => {
    selectProduct(product);
    onNavigate('product_detail', { product });
  };

  const handleLoadMore = () => {
    if (!isLoadingProducts && hasMoreProducts && !currentCategory) {
      fetchProducts();
    }
  };

  const formatPrice = (price: number, discount: number) => {
    const discounted = price * (1 - discount / 100);
    return `$${discounted.toFixed(2)}`;
  };

  const formatOriginalPrice = (price: number) => `$${price.toFixed(2)}`;

  // Render skeleton loaders
  const renderSkeletons = () => (
    <>
      {[1, 2, 3, 4].map(i => (
        <view key={i} className="product-skeleton">
          <view className="skeleton-image" />
          <view className="skeleton-content">
            <view className="skeleton-line short" />
            <view className="skeleton-line" />
            <view className="skeleton-line medium" />
          </view>
        </view>
      ))}
    </>
  );

  return (
    <view className="HomeScreen" accessibility-id="shop-home-screen">
      {/* Header */}
      <view className="home-header" accessibility-id="shop-header">
        <view className="header-top" accessibility-id="shop-header-top">
          <view className="brand-section" accessibility-id="shop-brand">
            <text className="brand-title" accessibility-id="shop-brand-title">LynxShop</text>
            <text className="brand-subtitle" accessibility-id="shop-brand-subtitle">Premium Store</text>
          </view>
          <view className="header-actions" accessibility-id="shop-header-actions">
            <view className="icon-btn" bindtap={() => onNavigate('search')} accessibility-id="shop-search-btn">
              <SearchIcon />
            </view>
            <view className="icon-btn" bindtap={() => onNavigate('cart')} accessibility-id="shop-cart-btn">
              <CartIcon count={cart.count} />
            </view>
            <view className="icon-btn" bindtap={() => onNavigate('profile')} accessibility-id="shop-profile-btn">
              <UserIcon />
            </view>
          </view>
        </view>
        
        {/* Search Bar - Quick Access */}
        <view className="search-bar" bindtap={() => onNavigate('search')} accessibility-id="shop-search-bar">
          <SearchIcon />
          <text className="search-placeholder" accessibility-id="shop-search-placeholder">Search products, brands...</text>
        </view>
      </view>

      {/* Categories - Horizontal Scroll */}
      <view className="categories-section" accessibility-id="shop-categories-section">
        <scroll-view className="categories-scroll" scroll-x accessibility-id="shop-categories-scroll">
          <view className="categories-list" accessibility-id="shop-categories-list">
            <view 
              className={`category-pill ${!currentCategory ? 'active' : ''}`}
              bindtap={() => fetchProducts(true)}
              accessibility-id="shop-category-all"
            >
              <text className="category-pill-text" accessibility-id="shop-category-all-text">All</text>
            </view>
            {categories.map((category, index) => (
              <view
                key={category.slug}
                className={`category-pill ${currentCategory === category.slug ? 'active' : ''}`}
                bindtap={() => fetchProductsByCategory(category.slug)}
                accessibility-id={`shop-category-${index}`}
              >
                <text className="category-pill-text" accessibility-id={`shop-category-text-${index}`}>
                  {category.name}
                </text>
              </view>
            ))}
          </view>
        </scroll-view>
      </view>

      {/* Product Grid */}
      <scroll-view 
        className="products-scroll" 
        scroll-y
        bindscrolltolower={handleLoadMore}
        accessibility-id="shop-products-scroll"
      >
        {/* Section Header */}
        <view className="section-header" accessibility-id="shop-section-header">
          <text className="section-title" accessibility-id="shop-section-title">
            {currentCategory ? currentCategory.replace(/-/g, ' ') : 'Featured Products'}
          </text>
          <view className="view-all" bindtap={() => onNavigate('search')} accessibility-id="shop-view-all">
            <text className="view-all-text" accessibility-id="shop-view-all-text">View All</text>
            <ChevronRightIcon />
          </view>
        </view>

        <view className="products-grid" accessibility-id="shop-products-grid">
          {isLoadingProducts && products.length === 0 ? (
            renderSkeletons()
          ) : products.length === 0 ? (
            <view className="empty-state" accessibility-id="shop-empty-state">
              <view className="empty-icon" accessibility-id="shop-empty-icon">📦</view>
              <text className="empty-title" accessibility-id="shop-empty-title">No products found</text>
              <text className="empty-subtitle" accessibility-id="shop-empty-subtitle">Try a different category</text>
            </view>
          ) : (
            products.map((product, index) => (
              <view 
                key={product.id} 
                className="product-card"
                bindtap={() => handleProductPress(product)}
                style={{ animationDelay: `${index * 50}ms` }}
                accessibility-id={`product-${index}`}
              >
                {/* Image Container */}
                <view className="product-image-wrap" accessibility-id={`product-image-wrap-${index}`}>
                  <image 
                    className="product-image" 
                    src={product.thumbnail}
                    mode="aspectFill"
                    accessibility-id={`product-image-${index}`}
                  />
                  {product.discountPercentage > 0 && (
                    <view className="discount-badge" accessibility-id={`product-discount-${index}`}>
                      <text className="discount-text" accessibility-id={`product-discount-text-${index}`}>-{Math.round(product.discountPercentage)}%</text>
                    </view>
                  )}
                  {/* Quick Add Button */}
                  <view 
                    className="quick-add-btn"
                    bindtap={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    accessibility-id={`product-quick-add-${index}`}
                  >
                    <text className="quick-add-icon" accessibility-id={`product-quick-add-icon-${index}`}>+</text>
                  </view>
                </view>
                
                {/* Content */}
                <view className="product-content" accessibility-id={`product-content-${index}`}>
                  <text className="product-brand" accessibility-id={`product-brand-${index}`}>{product.brand}</text>
                  <text className="product-name" number-of-lines={2} accessibility-id={`product-name-${index}`}>{product.title}</text>
                  
                  <view className="product-rating" accessibility-id={`product-rating-${index}`}>
                    <StarIcon />
                    <text className="rating-value" accessibility-id={`product-rating-value-${index}`}>{product.rating}</text>
                    <text className="rating-count" accessibility-id={`product-rating-count-${index}`}>({Math.floor(Math.random() * 500) + 50})</text>
                  </view>
                  
                  <view className="product-price-row" accessibility-id={`product-price-row-${index}`}>
                    <text className="product-price" accessibility-id={`product-price-${index}`}>
                      {formatPrice(product.price, product.discountPercentage)}
                    </text>
                    {product.discountPercentage > 0 && (
                      <text className="original-price" accessibility-id={`product-original-price-${index}`}>
                        {formatOriginalPrice(product.price)}
                      </text>
                    )}
                  </view>
                </view>
              </view>
            ))
          )}
        </view>
        
        {/* Load More Indicator */}
        {isLoadingProducts && products.length > 0 && (
          <view className="loading-more" accessibility-id="shop-loading-more">
            <view className="loading-spinner" accessibility-id="shop-loading-spinner" />
            <text className="loading-text" accessibility-id="shop-loading-text">Loading more...</text>
          </view>
        )}
        
        {!hasMoreProducts && products.length > 0 && !currentCategory && (
          <view className="end-message" accessibility-id="shop-end-message">
            <text className="end-text" accessibility-id="shop-end-text">You've reached the end</text>
          </view>
        )}
        
        {/* Bottom Safe Area */}
        <view className="bottom-spacer" accessibility-id="shop-bottom-spacer" />
      </scroll-view>

      {/* Floating Cart Button (when items in cart) */}
      {cart.count > 0 && (
        <view className="floating-cart" bindtap={() => onNavigate('cart')} accessibility-id="shop-floating-cart">
          <view className="floating-cart-inner" accessibility-id="shop-floating-cart-inner">
            <text className="floating-cart-count" accessibility-id="shop-floating-cart-count">{cart.count}</text>
            <text className="floating-cart-total" accessibility-id="shop-floating-cart-total">${cart.total.toFixed(2)}</text>
            <view className="floating-cart-arrow" accessibility-id="shop-floating-cart-arrow">
              <ChevronRightIcon />
            </view>
          </view>
        </view>
      )}
    </view>
  );
}
