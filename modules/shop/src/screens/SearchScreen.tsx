/**
 * Search Screen - Redesigned
 * Faster discovery, recent searches, better UX
 */

import { useState, useEffect, useCallback } from '@lynx-js/react';
import type { Product } from '../models/Product.js';
import type { Store } from '../store/index.js';
import './SearchScreen.css';

interface SearchScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
}

// Icons (using emojis and text)
const BackIcon = () => (
  <text className="icon-svg">←</text>
);

const SearchIcon = () => (
  <text className="search-icon-svg">🔍</text>
);

const ClearIcon = () => (
  <text className="clear-icon-svg">✕</text>
);

const ClockIcon = () => (
  <text className="history-icon-svg">🕐</text>
);

const TrendingIcon = () => (
  <text className="trending-icon-svg">📈</text>
);

const ArrowRightIcon = () => (
  <text className="arrow-icon-svg">→</text>
);

const EmptySearchIcon = () => (
  <text className="empty-icon-svg">🔍</text>
);

const StarIcon = () => (
  <text className="star-svg">⭐</text>
);

// Mock recent searches and trending
const RECENT_SEARCHES = ['iphone', 'laptop', 'perfume'];
const TRENDING_SEARCHES = ['smartphone', 'beauty', 'fragrances', 'laptops'];

export function SearchScreen({ store, onNavigate, onBack }: SearchScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);
  
  const {
    searchResults,
    isSearching,
    cart,
    searchProducts,
    clearSearch,
    addToCart,
    selectProduct,
  } = store;

  const handleSearch = useCallback((text: string) => {
    setInputValue(text);
    if (text.length >= 2) {
      searchProducts(text);
    } else if (text.length === 0) {
      clearSearch();
    }
  }, [searchProducts, clearSearch]);

  const handleSearchSubmit = () => {
    if (inputValue.trim().length >= 2) {
      // Add to recent searches
      if (!recentSearches.includes(inputValue.trim().toLowerCase())) {
        setRecentSearches(prev => [inputValue.trim().toLowerCase(), ...prev.slice(0, 4)]);
      }
      searchProducts(inputValue.trim());
    }
  };

  const handleRecentSearch = (term: string) => {
    setInputValue(term);
    searchProducts(term);
  };

  const removeRecentSearch = (term: string, e: any) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(s => s !== term));
  };

  const handleProductPress = (product: Product) => {
    selectProduct(product);
    onNavigate('product_detail', { product });
  };

  const formatPrice = (price: number, discount: number) => {
    const discounted = price * (1 - discount / 100);
    return `$${discounted.toFixed(2)}`;
  };

  const hasResults = searchResults.length > 0;
  const isSearchingMode = inputValue.length >= 2;

  return (
    <view className="SearchScreen" accessibility-id="search-screen">
      {/* Header with Search */}
      <view className="search-header" accessibility-id="search-header">
        <view className="header-btn" bindtap={onBack} accessibility-id="search-back-btn">
          <BackIcon />
        </view>
        <view className={`search-input-wrap ${isFocused ? 'focused' : ''}`} accessibility-id="search-input-wrap">
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Search products, brands..."
            bindinput={(e) => handleSearch(e.detail.value)}
            bindfocus={() => setIsFocused(true)}
            bindblur={() => setIsFocused(false)}
            accessibility-id="search-input"
          />
          {inputValue.length > 0 && (
            <view className="clear-btn" bindtap={() => handleSearch('')} accessibility-id="search-clear-btn">
              <ClearIcon />
            </view>
          )}
        </view>
      </view>

      {/* Content Area */}
      <scroll-view className="search-scroll" scroll-y accessibility-id="search-scroll">
        {/* Initial State - Show Recent & Trending */}
        {!isSearchingMode && !hasResults && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <view className="search-section" accessibility-id="search-recent-section">
                <view className="section-header-row" accessibility-id="search-recent-header">
                  <text className="section-title" accessibility-id="search-recent-title">Recent Searches</text>
                  <text className="clear-all" bindtap={() => setRecentSearches([])} accessibility-id="search-clear-all">Clear All</text>
                </view>
                <view className="chips-list" accessibility-id="search-recent-chips">
                  {recentSearches.map((term, index) => (
                    <view key={term} className="search-chip recent" bindtap={() => handleRecentSearch(term)} accessibility-id={`search-recent-chip-${index}`}>
                      <ClockIcon />
                      <text className="chip-text" accessibility-id={`search-recent-chip-text-${index}`}>{term}</text>
                      <view className="remove-chip" bindtap={(e) => removeRecentSearch(term, e)} accessibility-id={`search-recent-chip-remove-${index}`}>
                        <text className="remove-text">×</text>
                      </view>
                    </view>
                  ))}
                </view>
              </view>
            )}

            {/* Trending Searches */}
            <view className="search-section" accessibility-id="search-trending-section">
              <view className="section-header-row" accessibility-id="search-trending-header">
                <text className="section-title" accessibility-id="search-trending-title">Trending Now</text>
              </view>
              <view className="chips-list" accessibility-id="search-trending-chips">
                {TRENDING_SEARCHES.map((term, index) => (
                  <view key={term} className="search-chip trending" bindtap={() => handleRecentSearch(term)} accessibility-id={`search-trending-chip-${index}`}>
                    <TrendingIcon />
                    <text className="chip-text" accessibility-id={`search-trending-chip-text-${index}`}>{term}</text>
                  </view>
                ))}
              </view>
            </view>

            {/* Popular Categories */}
            <view className="search-section" accessibility-id="search-categories-section">
              <view className="section-header-row" accessibility-id="search-categories-header">
                <text className="section-title" accessibility-id="search-categories-title">Browse Categories</text>
              </view>
              <view className="category-grid" accessibility-id="search-category-grid">
                {['Smartphones', 'Laptops', 'Beauty', 'Fragrances'].map((cat, index) => (
                  <view key={cat} className="category-card" bindtap={() => onNavigate('home')} accessibility-id={`search-category-${index}`}>
                    <view className="category-icon-wrap" accessibility-id={`search-category-icon-${index}`}>
                      <text className="category-emoji" accessibility-id={`search-category-emoji-${index}`}>
                        {cat === 'Smartphones' && '📱'}
                        {cat === 'Laptops' && '💻'}
                        {cat === 'Beauty' && '✨'}
                        {cat === 'Fragrances' && '🌸'}
                      </text>
                    </view>
                    <text className="category-name" accessibility-id={`search-category-name-${index}`}>{cat}</text>
                    <ArrowRightIcon />
                  </view>
                ))}
              </view>
            </view>
          </>
        )}

        {/* Searching State */}
        {isSearching && (
          <view className="search-loading" accessibility-id="search-loading">
            <view className="search-spinner" accessibility-id="search-spinner" />
            <text className="loading-text" accessibility-id="search-loading-text">Searching...</text>
          </view>
        )}

        {/* No Results State */}
        {isSearchingMode && !isSearching && !hasResults && (
          <view className="no-results" accessibility-id="search-no-results">
            <EmptySearchIcon />
            <text className="no-results-title" accessibility-id="search-no-results-title">No results found</text>
            <text className="no-results-subtitle" accessibility-id="search-no-results-subtitle">Try adjusting your search terms</text>
            <view className="suggestion-chips" accessibility-id="search-suggestion-chips">
              <text className="suggestion-label" accessibility-id="search-suggestion-label">Try:</text>
              {['phone', 'laptop', 'beauty'].map((s, index) => (
                <view key={s} className="suggestion-chip" bindtap={() => handleRecentSearch(s)} accessibility-id={`search-suggestion-${index}`}>
                  <text className="suggestion-text" accessibility-id={`search-suggestion-text-${index}`}>{s}</text>
                </view>
              ))}
            </view>
          </view>
        )}

        {/* Search Results */}
        {hasResults && !isSearching && (
          <view className="results-section" accessibility-id="search-results-section">
            <view className="results-header" accessibility-id="search-results-header">
              <text className="results-count" accessibility-id="search-results-count">{searchResults.length} results for "{inputValue}"</text>
            </view>
            
            <view className="results-list" accessibility-id="search-results-list">
              {searchResults.map((product, index) => (
                <view 
                  key={product.id} 
                  className="result-item"
                  bindtap={() => handleProductPress(product)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  accessibility-id={`search-result-${index}`}
                >
                  <image 
                    className="result-image" 
                    src={product.thumbnail}
                    mode="aspectFill"
                    accessibility-id={`search-result-image-${index}`}
                  />
                  <view className="result-content" accessibility-id={`search-result-content-${index}`}>
                    <text className="result-brand" accessibility-id={`search-result-brand-${index}`}>{product.brand}</text>
                    <text className="result-name" number-of-lines={2} accessibility-id={`search-result-name-${index}`}>{product.title}</text>
                    <view className="result-meta" accessibility-id={`search-result-meta-${index}`}>
                      <view className="result-rating" accessibility-id={`search-result-rating-${index}`}>
                        <StarIcon />
                        <text className="rating-text" accessibility-id={`search-result-rating-text-${index}`}>{product.rating}</text>
                      </view>
                      <text className="result-price" accessibility-id={`search-result-price-${index}`}>
                        {formatPrice(product.price, product.discountPercentage)}
                      </text>
                    </view>
                  </view>
                  <view 
                    className="result-add-btn"
                    bindtap={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    accessibility-id={`search-result-add-btn-${index}`}
                  >
                    <text className="add-icon" accessibility-id={`search-result-add-icon-${index}`}>+</text>
                  </view>
                </view>
              ))}
            </view>
          </view>
        )}

        <view className="bottom-spacer" accessibility-id="search-bottom-spacer" />
      </scroll-view>

      {/* Cart Quick Access */}
      {cart.count > 0 && (
        <view className="search-cart-bar" bindtap={() => onNavigate('cart')} accessibility-id="search-cart-bar">
          <view className="cart-info" accessibility-id="search-cart-info">
            <view className="cart-badge-sm" accessibility-id="search-cart-badge">{cart.count}</view>
            <text className="cart-total" accessibility-id="search-cart-total">${cart.total.toFixed(2)}</text>
          </view>
          <ArrowRightIcon />
        </view>
      )}
    </view>
  );
}
