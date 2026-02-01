/**
 * Product Detail Screen - Redesigned
 * Immersive experience with reduced friction
 */

import { useState, useEffect } from '@lynx-js/react';
import type { Product } from '../models/Product.js';
import type { Store } from '../store/index.js';
import './ProductDetailScreen.css';

interface ProductDetailScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
}

// Icons (using emojis and text)
const BackIcon = () => (
  <text className="icon-svg">←</text>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <text className="icon-svg">{filled ? '❤️' : '🤍'}</text>
);

const StarIcon = () => (
  <text className="star-svg">⭐</text>
);

const ShareIcon = () => (
  <text className="icon-svg">↗️</text>
);

const TruckIcon = () => (
  <text className="icon-svg-sm">🚚</text>
);

const ShieldIcon = () => (
  <text className="icon-svg-sm">🛡️</text>
);

const MinusIcon = () => (
  <text className="qty-icon">−</text>
);

const PlusIcon = () => (
  <text className="qty-icon">+</text>
);

export function ProductDetailScreen({ store, onNavigate, onBack }: ProductDetailScreenProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  
  const { selectedProduct, cart, addToCart } = store;
  
  useEffect(() => {
    // Reset state when product changes
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [selectedProduct?.id]);
  
  if (!selectedProduct) {
    return (
      <view className="ProductDetailScreen">
        <view className="detail-header">
          <view className="header-btn" bindtap={onBack}>
            <BackIcon />
          </view>
        </view>
        <view className="error-state">
          <text className="error-title">Product not found</text>
          <text className="error-subtitle">The product you're looking for doesn't exist</text>
        </view>
      </view>
    );
  }

  const product = selectedProduct;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const totalPrice = discountedPrice * quantity;
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('cart');
  };

  return (
    <view className="ProductDetailScreen" accessibility-id="product-detail-screen">
      {/* Toast Notification */}
      {showAddedToast && (
        <view className="toast" accessibility-id="product-toast">
          <text className="toast-text" accessibility-id="product-toast-text">Added to cart!</text>
        </view>
      )}

      {/* Header */}
      <view className="detail-header" accessibility-id="product-detail-header">
        <view className="header-btn" bindtap={onBack} accessibility-id="product-back-btn">
          <BackIcon />
        </view>
        <view className="header-actions" accessibility-id="product-header-actions">
          <view 
            className={`header-btn ${isWishlisted ? 'active' : ''}`}
            bindtap={() => setIsWishlisted(!isWishlisted)}
            accessibility-id="product-wishlist-btn"
          >
            <HeartIcon filled={isWishlisted} />
          </view>
          <view className="header-btn" accessibility-id="product-share-btn">
            <ShareIcon />
          </view>
        </view>
      </view>

      <scroll-view className="detail-scroll" scroll-y accessibility-id="product-detail-scroll">
        {/* Hero Image */}
        <view className="hero-image-container" accessibility-id="product-hero-image-container">
          <image 
            className="hero-image" 
            src={product.images[selectedImageIndex] || product.thumbnail}
            mode="aspectFit"
            accessibility-id="product-hero-image"
          />
          {product.discountPercentage > 0 && (
            <view className="hero-discount-badge" accessibility-id="product-hero-discount-badge">
              <text className="hero-discount-text" accessibility-id="product-hero-discount-text">{Math.round(product.discountPercentage)}% OFF</text>
            </view>
          )}
        </view>

        {/* Thumbnail Gallery */}
        {product.images.length > 1 && (
          <view className="thumbnail-section" accessibility-id="product-thumbnail-section">
            <scroll-view className="thumbnail-scroll" scroll-x accessibility-id="product-thumbnail-scroll">
              <view className="thumbnail-list" accessibility-id="product-thumbnail-list">
                {product.images.map((image, index) => (
                  <view 
                    key={index}
                    className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                    bindtap={() => setSelectedImageIndex(index)}
                    accessibility-id={`product-thumbnail-${index}`}
                  >
                    <image className="thumbnail-image" src={image} mode="aspectFill" accessibility-id={`product-thumbnail-image-${index}`} />
                  </view>
                ))}
              </view>
            </scroll-view>
          </view>
        )}

        {/* Product Info Card */}
        <view className="info-card" accessibility-id="product-info-card">
          {/* Brand & Category */}
          <view className="meta-row" accessibility-id="product-meta-row">
            <text className="brand-badge" accessibility-id="product-brand-badge">{product.brand}</text>
            <text className="category-badge" accessibility-id="product-category-badge">{product.category}</text>
          </view>
          
          {/* Title */}
          <text className="product-title" accessibility-id="product-title">{product.title}</text>
          
          {/* Rating Row */}
          <view className="rating-row" accessibility-id="product-rating-row">
            <view className="rating-stars" accessibility-id="product-rating-stars">
              <StarIcon />
              <text className="rating-score" accessibility-id="product-rating-score">{product.rating}</text>
            </view>
            <text className="review-count" accessibility-id="product-review-count">{Math.floor(Math.random() * 1000) + 100} reviews</text>
            <view className="stock-badge" style={{ backgroundColor: product.stock < 10 ? '#FEE2E2' : '#D1FAE5' }} accessibility-id="product-stock-badge">
              <text className="stock-text" style={{ color: product.stock < 10 ? '#DC2626' : '#059669' }} accessibility-id="product-stock-text">
                {product.stock < 10 ? 'Low Stock' : 'In Stock'}
              </text>
            </view>
          </view>

          {/* Price Section */}
          <view className="price-section" accessibility-id="product-price-section">
            <view className="price-row" accessibility-id="product-price-row">
              <text className="current-price" accessibility-id="product-current-price">${totalPrice.toFixed(2)}</text>
              {product.discountPercentage > 0 && (
                <text className="original-price" accessibility-id="product-original-price">${(product.price * quantity).toFixed(2)}</text>
              )}
            </view>
            {product.discountPercentage > 0 && (
              <text className="savings-text" accessibility-id="product-savings-text">
                You save ${((product.price - discountedPrice) * quantity).toFixed(2)}
              </text>
            )}
          </view>

          {/* Quantity Selector */}
          <view className="quantity-section" accessibility-id="product-quantity-section">
            <text className="section-label" accessibility-id="product-quantity-label">Quantity</text>
            <view className="quantity-selector" accessibility-id="product-quantity-selector">
              <view 
                className="qty-btn"
                bindtap={() => setQuantity(Math.max(1, quantity - 1))}
                accessibility-id="product-qty-decrease"
              >
                <MinusIcon />
              </view>
              <text className="qty-value" accessibility-id="product-qty-value">{quantity}</text>
              <view 
                className="qty-btn"
                bindtap={() => setQuantity(Math.min(product.stock, quantity + 1))}
                accessibility-id="product-qty-increase"
              >
                <PlusIcon />
              </view>
            </view>
          </view>

          {/* Description */}
          <view className="description-section" accessibility-id="product-description-section">
            <text className="section-label" accessibility-id="product-description-label">Description</text>
            <text className="description-text" accessibility-id="product-description-text">{product.description}</text>
          </view>

          {/* Features */}
          <view className="features-section" accessibility-id="product-features-section">
            <view className="feature-item" accessibility-id="product-feature-delivery">
              <view className="feature-icon-wrap" accessibility-id="product-feature-delivery-icon">
                <TruckIcon />
              </view>
              <view className="feature-content" accessibility-id="product-feature-delivery-content">
                <text className="feature-title" accessibility-id="product-feature-delivery-title">Free Delivery</text>
                <text className="feature-subtitle" accessibility-id="product-feature-delivery-subtitle">On orders over $50</text>
              </view>
            </view>
            <view className="feature-item" accessibility-id="product-feature-secure">
              <view className="feature-icon-wrap" accessibility-id="product-feature-secure-icon">
                <ShieldIcon />
              </view>
              <view className="feature-content" accessibility-id="product-feature-secure-content">
                <text className="feature-title" accessibility-id="product-feature-secure-title">Secure Payment</text>
                <text className="feature-subtitle" accessibility-id="product-feature-secure-subtitle">100% secure checkout</text>
              </view>
            </view>
          </view>

          {/* Specs */}
          <view className="specs-section" accessibility-id="product-specs-section">
            <text className="section-label" accessibility-id="product-specs-label">Specifications</text>
            <view className="spec-grid" accessibility-id="product-spec-grid">
              <view className="spec-item" accessibility-id="product-spec-brand">
                <text className="spec-label" accessibility-id="product-spec-brand-label">Brand</text>
                <text className="spec-value" accessibility-id="product-spec-brand-value">{product.brand}</text>
              </view>
              <view className="spec-item" accessibility-id="product-spec-category">
                <text className="spec-label" accessibility-id="product-spec-category-label">Category</text>
                <text className="spec-value" accessibility-id="product-spec-category-value">{product.category}</text>
              </view>
              <view className="spec-item" accessibility-id="product-spec-stock">
                <text className="spec-label" accessibility-id="product-spec-stock-label">Stock</text>
                <text className="spec-value" accessibility-id="product-spec-stock-value">{product.stock} units</text>
              </view>
              <view className="spec-item" accessibility-id="product-spec-rating">
                <text className="spec-label" accessibility-id="product-spec-rating-label">Rating</text>
                <text className="spec-value" accessibility-id="product-spec-rating-value">{product.rating}/5</text>
              </view>
            </view>
          </view>
        </view>

        {/* Bottom Spacer */}
        <view className="bottom-spacer" accessibility-id="product-bottom-spacer" />
      </scroll-view>

      {/* Bottom Actions */}
      <view className="bottom-actions" accessibility-id="product-bottom-actions">
        <view className="price-summary" accessibility-id="product-price-summary">
          <text className="summary-label" accessibility-id="product-summary-label">Total</text>
          <text className="summary-price" accessibility-id="product-summary-price">${totalPrice.toFixed(2)}</text>
        </view>
        <view className="action-buttons" accessibility-id="product-action-buttons">
          <view className="btn-secondary" bindtap={handleAddToCart} accessibility-id="product-add-to-cart-btn">
            <text className="btn-secondary-text" accessibility-id="product-add-to-cart-text">Add to Cart</text>
          </view>
          <view className="btn-primary" bindtap={handleBuyNow} accessibility-id="product-buy-now-btn">
            <text className="btn-primary-text" accessibility-id="product-buy-now-text">Buy Now</text>
          </view>
        </view>
      </view>
    </view>
  );
}
