/**
 * Profile Screen - Redesigned
 * Cleaner layout, better information hierarchy
 */

import { useState } from '@lynx-js/react';
import type { Store } from '../store/index.js';
import './ProfileScreen.css';

interface ProfileScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
}

// Icons (using emojis and text)
const BackIcon = () => (
  <text className="icon-svg">←</text>
);

const SettingsIcon = () => (
  <text className="icon-svg">⚙️</text>
);

const CartIcon = () => (
  <text className="menu-icon-svg">🛒</text>
);

const PackageIcon = () => (
  <text className="menu-icon-svg">📦</text>
);

const HeartIcon = () => (
  <text className="menu-icon-svg">❤️</text>
);

const MapPinIcon = () => (
  <text className="menu-icon-svg">📍</text>
);

const CreditCardIcon = () => (
  <text className="menu-icon-svg">💳</text>
);

const HelpIcon = () => (
  <text className="menu-icon-svg">❓</text>
);

const LogoutIcon = () => (
  <text className="menu-icon-svg">🚪</text>
);

const ChevronRightIcon = () => (
  <text className="chevron-icon">›</text>
);

const UserIcon = () => (
  <text className="empty-icon-svg">👤</text>
);

export function ProfileScreen({ store, onNavigate, onBack }: ProfileScreenProps) {
  const { auth, logout, cart } = store;

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const menuItems = [
    { icon: CartIcon, label: 'My Cart', badge: cart.count, action: () => onNavigate('cart') },
    { icon: PackageIcon, label: 'My Orders', badge: 0, action: () => {} },
    { icon: HeartIcon, label: 'Wishlist', badge: 0, action: () => {} },
    { icon: MapPinIcon, label: 'Addresses', action: () => {} },
    { icon: CreditCardIcon, label: 'Payment Methods', action: () => {} },
    { icon: HelpIcon, label: 'Help & Support', action: () => {} },
  ];

  // Not logged in state
  if (!auth.isAuthenticated || !auth.user) {
    return (
      <view className="ProfileScreen" accessibility-id="shop-profile-screen">
        <view className="profile-header" accessibility-id="shop-profile-header">
          <view className="header-btn" bindtap={onBack} accessibility-id="shop-profile-back-btn">
            <BackIcon />
          </view>
          <text className="profile-title" accessibility-id="shop-profile-title">Profile</text>
          <view className="header-spacer" accessibility-id="shop-profile-header-spacer" />
        </view>
        
        <view className="not-logged-in" accessibility-id="shop-profile-not-logged">
          <view className="not-logged-icon" accessibility-id="shop-profile-not-logged-icon">
            <UserIcon />
          </view>
          <text className="not-logged-title" accessibility-id="shop-profile-not-logged-title">Welcome Guest</text>
          <text className="not-logged-subtitle" accessibility-id="shop-profile-not-logged-subtitle">Sign in to access your orders, wishlist, and more</text>
          <view className="login-btn" bindtap={() => onNavigate('login', { returnTo: 'profile' })} accessibility-id="shop-profile-login-btn">
            <text className="login-btn-text" accessibility-id="shop-profile-login-btn-text">Sign In</text>
          </view>
          <view className="register-link" bindtap={() => onNavigate('login', { returnTo: 'profile' })} accessibility-id="shop-profile-register-link">
            <text className="register-text" accessibility-id="shop-profile-register-text">Don't have an account? </text>
            <text className="register-highlight" accessibility-id="shop-profile-register-highlight">Sign Up</text>
          </view>
        </view>
      </view>
    );
  }

  const user = auth.user;

  return (
    <view className="ProfileScreen" accessibility-id="shop-profile-screen">
      {/* Header */}
      <view className="profile-header" accessibility-id="shop-profile-header">
        <view className="header-btn" bindtap={onBack} accessibility-id="shop-profile-back-btn">
          <BackIcon />
        </view>
        <text className="profile-title" accessibility-id="shop-profile-title">Profile</text>
        <view className="header-btn" accessibility-id="shop-profile-settings-btn">
          <SettingsIcon />
        </view>
      </view>

      <scroll-view className="profile-scroll" scroll-y accessibility-id="shop-profile-scroll">
        {/* User Profile Card */}
        <view className="profile-card" accessibility-id="shop-profile-card">
          <view className="avatar-wrap" accessibility-id="shop-profile-avatar-wrap">
            <image className="user-avatar" src={user.image} mode="aspectFill" accessibility-id="shop-profile-avatar" />
            <view className="verified-badge" accessibility-id="shop-profile-verified-badge">
              <text className="verified-icon" accessibility-id="shop-profile-verified-icon">✓</text>
            </view>
          </view>
          <view className="user-details" accessibility-id="shop-profile-user-details">
            <text className="user-fullname" accessibility-id="shop-profile-fullname">{user.firstName} {user.lastName}</text>
            <text className="user-email" accessibility-id="shop-profile-user-email">{user.email}</text>
            <view className="member-badge" accessibility-id="shop-profile-member-badge">
              <text className="member-text" accessibility-id="shop-profile-member-text">Premium Member</text>
            </view>
          </view>
        </view>

        {/* Stats Grid */}
        <view className="stats-section" accessibility-id="shop-profile-stats-section">
          <view className="stat-box" accessibility-id="shop-profile-cart-stat">
            <text className="stat-value" accessibility-id="shop-profile-cart-count">{cart.count}</text>
            <text className="stat-label" accessibility-id="shop-profile-cart-label">In Cart</text>
          </view>
          <view className="stat-divider" accessibility-id="shop-profile-stat-divider-1" />
          <view className="stat-box" accessibility-id="shop-profile-orders-stat">
            <text className="stat-value" accessibility-id="shop-profile-orders-count">0</text>
            <text className="stat-label" accessibility-id="shop-profile-orders-label">Orders</text>
          </view>
          <view className="stat-divider" accessibility-id="shop-profile-stat-divider-2" />
          <view className="stat-box" accessibility-id="shop-profile-wishlist-stat">
            <text className="stat-value" accessibility-id="shop-profile-wishlist-count">0</text>
            <text className="stat-label" accessibility-id="shop-profile-wishlist-label">Wishlist</text>
          </view>
        </view>

        {/* Personal Info */}
        <view className="info-section" accessibility-id="shop-profile-info-section">
          <text className="section-title" accessibility-id="shop-profile-info-title">Personal Information</text>
          <view className="info-card" accessibility-id="shop-profile-info-card">
            <view className="info-row" accessibility-id="shop-profile-username-row">
              <text className="info-label" accessibility-id="shop-profile-username-label">Username</text>
              <text className="info-value" accessibility-id="shop-profile-username-value">@{user.username}</text>
            </view>
            <view className="info-row" accessibility-id="shop-profile-phone-row">
              <text className="info-label" accessibility-id="shop-profile-phone-label">Phone</text>
              <text className="info-value" accessibility-id="shop-profile-phone-value">{user.phone || 'Not added'}</text>
            </view>
            <view className="info-row" accessibility-id="shop-profile-birth-row">
              <text className="info-label" accessibility-id="shop-profile-birth-label">Birth Date</text>
              <text className="info-value" accessibility-id="shop-profile-birth-value">{user.birthDate || 'Not added'}</text>
            </view>
            <view className="info-row" accessibility-id="shop-profile-gender-row">
              <text className="info-label" accessibility-id="shop-profile-gender-label">Gender</text>
              <text className="info-value" style={{ textTransform: 'capitalize' }} accessibility-id="shop-profile-gender-value">
                {user.gender || 'Not specified'}
              </text>
            </view>
          </view>
        </view>

        {/* Menu */}
        <view className="menu-section" accessibility-id="shop-profile-menu-section">
          <text className="section-title" accessibility-id="shop-profile-menu-title">Account</text>
          <view className="menu-card" accessibility-id="shop-profile-menu-card">
            {menuItems.map((item, index) => (
              <view key={item.label} className="menu-item" bindtap={item.action} accessibility-id={`shop-profile-menu-item-${index}`}>
                <view className="menu-icon-wrap" accessibility-id={`shop-profile-menu-icon-wrap-${index}`}>
                  <item.icon />
                </view>
                <text className="menu-label" accessibility-id={`shop-profile-menu-label-${index}`}>{item.label}</text>
                {item.badge ? (
                  <view className="menu-badge" accessibility-id={`shop-profile-menu-badge-${index}`}>
                    <text className="menu-badge-text" accessibility-id={`shop-profile-menu-badge-text-${index}`}>{item.badge}</text>
                  </view>
                ) : null}
                <ChevronRightIcon />
              </view>
            ))}
          </view>
        </view>

        {/* Logout */}
        <view className="logout-section" accessibility-id="shop-profile-logout-section">
          <view className="logout-btn" bindtap={handleLogout} accessibility-id="shop-profile-logout-btn">
            <LogoutIcon />
            <text className="logout-text" accessibility-id="shop-profile-logout-text">Sign Out</text>
          </view>
        </view>

        <view className="bottom-spacer" accessibility-id="shop-profile-bottom-spacer" />
      </scroll-view>
    </view>
  );
}
