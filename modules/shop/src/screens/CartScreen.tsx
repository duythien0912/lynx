/**
 * Cart Screen - Redesigned
 * Reduced friction, clear hierarchy, faster checkout
 */

import { useState } from '@lynx-js/react';
import type { Store } from '../store/index.js';
import './CartScreen.css';

interface CartScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
}

// Icons (using emojis and text)
const BackIcon = () => (
  <text className="icon-svg">←</text>
);

const TrashIcon = () => (
  <text className="icon-svg-sm">🗑️</text>
);

const MinusIcon = () => (
  <text className="qty-icon">−</text>
);

const PlusIcon = () => (
  <text className="qty-icon">+</text>
);

const TruckIcon = () => (
  <text className="icon-svg-xs">🚚</text>
);

const TagIcon = () => (
  <text className="icon-svg-xs">🏷️</text>
);

const ChevronRightIcon = () => (
  <text className="chevron-icon">›</text>
);

const ShoppingBagIcon = () => (
  <text className="empty-icon-svg">🛍️</text>
);

const SuccessIcon = () => (
  <text className="success-icon-svg">✓</text>
);

export function CartScreen({ store, onNavigate, onBack }: CartScreenProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  const { 
    cart, 
    auth,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    checkout,
  } = store;

  const handleCheckout = async () => {
    if (!auth.isAuthenticated) {
      onNavigate('login', { returnTo: 'cart' });
      return;
    }
    
    if (cart.items.length === 0) return;
    
    setIsCheckingOut(true);
    const success = await checkout();
    setIsCheckingOut(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onNavigate('home');
      }, 2500);
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const subtotal = cart.total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (showSuccess) {
    return (
      <view className="CartScreen" accessibility-id="cart-success-screen">
        <view className="success-container" accessibility-id="cart-success-container">
          <view className="success-animation" accessibility-id="cart-success-animation">
            <SuccessIcon />
          </view>
          <text className="success-title" accessibility-id="cart-success-title">Order Confirmed!</text>
          <text className="success-message" accessibility-id="cart-success-message">Your order has been placed successfully</text>
          <view className="success-details" accessibility-id="cart-success-details">
            <text className="success-order" accessibility-id="cart-success-order">Order #{Math.floor(Math.random() * 90000) + 10000}</text>
          </view>
        </view>
      </view>
    );
  }

  return (
    <view className="CartScreen" accessibility-id="cart-screen">
      {/* Header */}
      <view className="cart-header" accessibility-id="cart-header">
        <view className="header-btn" bindtap={onBack} accessibility-id="cart-back-btn">
          <BackIcon />
        </view>
        <text className="cart-title" accessibility-id="cart-title">Shopping Cart</text>
        {cart.items.length > 0 && (
          <view className="clear-btn" bindtap={clearCart} accessibility-id="cart-clear-btn">
            <text className="clear-text" accessibility-id="cart-clear-text">Clear</text>
          </view>
        )}
        {cart.items.length === 0 && <view className="header-spacer" accessibility-id="cart-header-spacer" />}
      </view>

      {cart.items.length === 0 ? (
        <view className="empty-cart" accessibility-id="cart-empty-state">
          <view className="empty-illustration" accessibility-id="cart-empty-illustration">
            <ShoppingBagIcon />
          </view>
          <text className="empty-title" accessibility-id="cart-empty-title">Your cart is empty</text>
          <text className="empty-subtitle" accessibility-id="cart-empty-subtitle">Looks like you haven't added anything yet</text>
          <view className="browse-btn" bindtap={() => onNavigate('home')} accessibility-id="cart-browse-btn">
            <text className="browse-text" accessibility-id="cart-browse-text">Start Shopping</text>
          </view>
        </view>
      ) : (
        <>
          <scroll-view className="cart-scroll" scroll-y accessibility-id="cart-scroll">
            {/* Cart Items */}
            <view className="cart-items-section" accessibility-id="cart-items-section">
              <text className="section-header-text" accessibility-id="cart-items-count">{cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}</text>
              
              {cart.items.map((item, index) => (
                <view key={item.product.id} className="cart-item" style={{ animationDelay: `${index * 50}ms` }} accessibility-id={`cart-item-${index}`}>
                  <image 
                    className="cart-item-image" 
                    src={item.product.thumbnail}
                    mode="aspectFill"
                    accessibility-id={`cart-item-image-${index}`}
                  />
                  <view className="cart-item-details" accessibility-id={`cart-item-details-${index}`}>
                    <text className="cart-item-brand" accessibility-id={`cart-item-brand-${index}`}>{item.product.brand}</text>
                    <text className="cart-item-name" number-of-lines={2} accessibility-id={`cart-item-name-${index}`}>{item.product.title}</text>
                    <text className="cart-item-price" accessibility-id={`cart-item-price-${index}`}>
                      {formatPrice(item.product.price * (1 - item.product.discountPercentage / 100))}
                    </text>
                  </view>
                  <view className="cart-item-actions" accessibility-id={`cart-item-actions-${index}`}>
                    <view className="delete-btn" bindtap={() => removeFromCart(item.product.id)} accessibility-id={`cart-item-delete-${index}`}>
                      <TrashIcon />
                    </view>
                    <view className="qty-control" accessibility-id={`cart-item-qty-control-${index}`}>
                      <view 
                        className="qty-btn-sm"
                        bindtap={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        accessibility-id={`cart-item-qty-decrease-${index}`}
                      >
                        <MinusIcon />
                      </view>
                      <text className="qty-display" accessibility-id={`cart-item-qty-${index}`}>{item.quantity}</text>
                      <view 
                        className="qty-btn-sm"
                        bindtap={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        accessibility-id={`cart-item-qty-increase-${index}`}
                      >
                        <PlusIcon />
                      </view>
                    </view>
                  </view>
                </view>
              ))}
            </view>

            {/* Promo Code Section */}
            <view className="promo-section" accessibility-id="cart-promo-section">
              {showPromoInput ? (
                <view className="promo-input-wrap" accessibility-id="cart-promo-input-wrap">
                  <input
                    className="promo-input"
                    type="text"
                    placeholder="Enter promo code"
                    bindinput={(e) => setPromoCode(e.detail.value)}
                    accessibility-id="cart-promo-input"
                  />
                  <view className="promo-apply-btn" bindtap={() => setShowPromoInput(false)} accessibility-id="cart-promo-apply-btn">
                    <text className="promo-apply-text" accessibility-id="cart-promo-apply-text">Apply</text>
                  </view>
                </view>
              ) : (
                <view className="promo-trigger" bindtap={() => setShowPromoInput(true)} accessibility-id="cart-promo-trigger">
                  <view className="promo-icon-wrap" accessibility-id="cart-promo-icon-wrap">
                    <TagIcon />
                  </view>
                  <text className="promo-text" accessibility-id="cart-promo-text">Apply Promo Code</text>
                  <ChevronRightIcon />
                </view>
              )}
            </view>

            {/* Order Summary */}
            <view className="summary-section" accessibility-id="cart-summary-section">
              <text className="section-header-text" accessibility-id="cart-summary-title">Order Summary</text>
              
              <view className="summary-row" accessibility-id="cart-subtotal-row">
                <text className="summary-label" accessibility-id="cart-subtotal-label">Subtotal</text>
                <text className="summary-value" accessibility-id="cart-subtotal-value">{formatPrice(subtotal)}</text>
              </view>
              
              <view className="summary-row" accessibility-id="cart-shipping-row">
                <text className="summary-label" accessibility-id="cart-shipping-label">Shipping</text>
                <text className={`summary-value ${shipping === 0 ? 'free' : ''}`} accessibility-id="cart-shipping-value">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </text>
              </view>
              
              <view className="summary-row" accessibility-id="cart-tax-row">
                <text className="summary-label" accessibility-id="cart-tax-label">Tax (8%)</text>
                <text className="summary-value" accessibility-id="cart-tax-value">{formatPrice(tax)}</text>
              </view>

              {shipping > 0 && (
                <view className="free-shipping-banner" accessibility-id="cart-free-shipping-banner">
                  <TruckIcon />
                  <text className="free-shipping-text" accessibility-id="cart-free-shipping-text">
                    Add {formatPrice(50 - subtotal)} more for FREE shipping!
                  </text>
                </view>
              )}
              
              <view className="summary-divider" accessibility-id="cart-summary-divider" />
              
              <view className="summary-row total" accessibility-id="cart-total-row">
                <text className="total-label" accessibility-id="cart-total-label">Total</text>
                <view className="total-wrap" accessibility-id="cart-total-wrap">
                  <text className="total-currency" accessibility-id="cart-total-currency">USD</text>
                  <text className="total-amount" accessibility-id="cart-total-amount">{formatPrice(total)}</text>
                </view>
              </view>
            </view>

            {/* Bottom Spacer */}
            <view className="cart-bottom-spacer" />
          </scroll-view>

          {/* Checkout Bar */}
          <view className="checkout-bar" accessibility-id="cart-checkout-bar">
            <view className="checkout-info" accessibility-id="cart-checkout-info">
              <text className="checkout-total" accessibility-id="cart-checkout-total">{formatPrice(total)}</text>
              <text className="checkout-items" accessibility-id="cart-checkout-items">{cart.count} items</text>
            </view>
            <view 
              className={`checkout-btn ${isCheckingOut ? 'loading' : ''}`}
              bindtap={handleCheckout}
              accessibility-id="cart-checkout-btn"
            >
              {isCheckingOut ? (
                <view className="spinner" accessibility-id="cart-checkout-spinner" />
              ) : (
                <text className="checkout-btn-text" accessibility-id="cart-checkout-btn-text">Checkout</text>
              )}
            </view>
          </view>
        </>
      )}
    </view>
  );
}
