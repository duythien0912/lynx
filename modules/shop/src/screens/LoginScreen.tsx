/**
 * Login Screen - Redesigned
 * Reduced friction, cleaner UX, better visual hierarchy
 */

import { useState } from '@lynx-js/react';
import type { Store } from '../store/index.js';
import './LoginScreen.css';

interface LoginScreenProps {
  store: Store;
  onNavigate: (screen: string, params?: unknown) => void;
  onBack: () => void;
  returnTo?: string;
}

// Icons (using emojis and text)
const BackIcon = () => (
  <text className="icon-svg">←</text>
);

const MailIcon = () => (
  <text className="input-icon-svg">✉️</text>
);

const LockIcon = () => (
  <text className="input-icon-svg">🔒</text>
);

const EyeIcon = () => (
  <text className="eye-icon-svg">👁️</text>
);

const EyeOffIcon = () => (
  <text className="eye-icon-svg">🙈</text>
);

const GoogleIcon = () => (
  <text className="social-icon-svg">G</text>
);

const AppleIcon = () => (
  <text className="social-icon-svg">🍎</text>
);

const ShoppingBagIcon = () => (
  <text className="logo-icon-svg">🛍️</text>
);

export function LoginScreen({ store, onNavigate, onBack, returnTo = 'home' }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { auth, login } = store;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    
    const success = await login(username.trim(), password.trim());
    if (success) {
      onNavigate(returnTo);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('atuny0');
    setPassword('password');
  };

  const isFormValid = username.trim().length >= 3 && password.trim().length >= 4;

  return (
    <view className="LoginScreen" accessibility-id="login-screen">
      {/* Header */}
      <view className="login-header" accessibility-id="login-header">
        <view className="header-btn" bindtap={onBack} accessibility-id="login-back-btn">
          <BackIcon />
        </view>
      </view>

      <scroll-view className="login-scroll" scroll-y accessibility-id="login-scroll">
        <view className="login-content" accessibility-id="login-content">
          {/* Logo Section */}
          <view className="logo-section" accessibility-id="login-logo-section">
            <view className="logo-circle" accessibility-id="login-logo-circle">
              <ShoppingBagIcon />
            </view>
            <text className="logo-title" accessibility-id="login-logo-title">Welcome Back</text>
            <text className="logo-subtitle" accessibility-id="login-logo-subtitle">Sign in to continue shopping</text>
          </view>

          {/* Demo Credentials Hint */}
          <view className="demo-hint" bindtap={fillDemoCredentials} accessibility-id="login-demo-hint">
            <view className="demo-icon" accessibility-id="login-demo-icon">
              <text className="demo-emoji" accessibility-id="login-demo-emoji">👆</text>
            </view>
            <view className="demo-text-wrap" accessibility-id="login-demo-text-wrap">
              <text className="demo-title" accessibility-id="login-demo-title">Demo Mode</text>
              <text className="demo-subtitle" accessibility-id="login-demo-subtitle">Tap to use test credentials</text>
            </view>
          </view>

          {/* Form */}
          <view className="login-form" accessibility-id="login-form">
            {/* Username Input */}
            <view className="input-group" accessibility-id="login-username-group">
              <text className="input-label" accessibility-id="login-username-label">Username</text>
              <view className={`input-wrap ${username ? 'has-value' : ''}`} accessibility-id="login-username-wrap">
                <MailIcon />
                <input
                  className="text-input"
                  type="text"
                  placeholder="Enter your username"
                  bindinput={(e) => setUsername(e.detail.value)}
                  accessibility-id="login-username-input"
                />
              </view>
            </view>

            {/* Password Input */}
            <view className="input-group" accessibility-id="login-password-group">
              <text className="input-label" accessibility-id="login-password-label">Password</text>
              <view className={`input-wrap ${password ? 'has-value' : ''}`} accessibility-id="login-password-wrap">
                <LockIcon />
                <input
                  className="text-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  bindinput={(e) => setPassword(e.detail.value)}
                  accessibility-id="login-password-input"
                />
                <view 
                  className="eye-btn"
                  bindtap={() => setShowPassword(!showPassword)}
                  accessibility-id="login-eye-btn"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </view>
              </view>
            </view>

            {/* Remember & Forgot */}
            <view className="form-options" accessibility-id="login-form-options">
              <view className="remember-wrap" bindtap={() => setRememberMe(!rememberMe)} accessibility-id="login-remember-wrap">
                <view className={`checkbox ${rememberMe ? 'checked' : ''}`} accessibility-id="login-remember-checkbox">
                  {rememberMe && <text className="checkmark">✓</text>}
                </view>
                <text className="remember-text" accessibility-id="login-remember-text">Remember me</text>
              </view>
              <text className="forgot-text" accessibility-id="login-forgot-text">Forgot Password?</text>
            </view>

            {/* Error Message */}
            {auth.error && (
              <view className="error-banner" accessibility-id="login-error-banner">
                <text className="error-text" accessibility-id="login-error-text">{auth.error}</text>
              </view>
            )}

            {/* Login Button */}
            <view 
              className={`login-btn ${!isFormValid ? 'disabled' : ''} ${auth.isLoading ? 'loading' : ''}`}
              bindtap={handleLogin}
              accessibility-id="login-submit-btn"
            >
              {auth.isLoading ? (
                <view className="btn-spinner" accessibility-id="login-btn-spinner" />
              ) : (
                <text className="login-btn-text" accessibility-id="login-submit-btn-text">Sign In</text>
              )}
            </view>

            {/* Divider */}
            <view className="divider" accessibility-id="login-divider">
              <view className="divider-line" accessibility-id="login-divider-line-left" />
              <text className="divider-text" accessibility-id="login-divider-text">or continue with</text>
              <view className="divider-line" accessibility-id="login-divider-line-right" />
            </view>

            {/* Social Login */}
            <view className="social-login" accessibility-id="login-social-login">
              <view className="social-btn" accessibility-id="login-google-btn">
                <GoogleIcon />
              </view>
              <view className="social-btn" accessibility-id="login-apple-btn">
                <AppleIcon />
              </view>
            </view>
          </view>

          {/* Footer */}
          <view className="login-footer" accessibility-id="login-footer">
            <text className="footer-text" accessibility-id="login-footer-text">Don't have an account? </text>
            <text className="footer-link" accessibility-id="login-footer-link">Create Account</text>
          </view>
        </view>

        <view className="bottom-spacer" accessibility-id="login-bottom-spacer" />
      </scroll-view>
    </view>
  );
}
