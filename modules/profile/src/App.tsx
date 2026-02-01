import { useCallback, useState, useEffect } from '@lynx-js/react'
import './App.css'

interface User {
  name: string
  email: string
  memberSince: string
  orders: number
  points: number
  isLoggedIn: boolean
}

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.()
  }, [])

  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: '2024-01-15',
    orders: 12,
    points: 1250,
    isLoggedIn: true,
  })

  const handleLogout = useCallback(() => {
    setUser(prev => ({ ...prev, isLoggedIn: false }))
  }, [])

  const handleLogin = useCallback(() => {
    setUser(prev => ({ ...prev, isLoggedIn: true }))
  }, [])

  if (!user.isLoggedIn) {
    return (
      <view className='Profile' accessibility-id="profile-container">
        <view className='LoginContainer' accessibility-id="profile-login-prompt">
          <text className='LoginTitle' accessibility-id="profile-login-title">Welcome Back</text>
          <text className='LoginSubtitle' accessibility-id="profile-login-subtitle">Sign in to access your profile</text>
          <view className='LoginButton' bindtap={handleLogin} accessibility-id="profile-login-btn">
            <text className='ButtonText' accessibility-id="profile-login-btn-text">Login</text>
          </view>
        </view>
      </view>
    )
  }

  return (
    <view className='Profile' accessibility-id="profile-container">
      <view className='Header' accessibility-id="profile-header">
        <text className='Title' accessibility-id="profile-title">Profile</text>
        <text className='LogoutText' bindtap={handleLogout} accessibility-id="profile-logout-text">Logout</text>
      </view>

      <view className='ProfileCard' accessibility-id="profile-card">
        <view className='Avatar' accessibility-id="profile-avatar">
          <text className='AvatarText' accessibility-id="profile-avatar-text">{user.name.charAt(0)}</text>
        </view>
        <text className='UserName' accessibility-id="profile-name">{user.name}</text>
        <text className='UserEmail' accessibility-id="profile-email">{user.email}</text>
        <text className='MemberSince' accessibility-id="profile-member-since">Member since {user.memberSince}</text>
      </view>

      <view className='StatsRow' accessibility-id="profile-stats">
        <view className='StatItem' accessibility-id="profile-orders-stat">
          <text className='StatValue' accessibility-id="profile-orders-count">{user.orders}</text>
          <text className='StatLabel' accessibility-id="profile-orders-label">Orders</text>
        </view>
        <view className='StatDivider' accessibility-id="profile-stat-divider" />
        <view className='StatItem' accessibility-id="profile-points-stat">
          <text className='StatValue' accessibility-id="profile-points-count">{user.points}</text>
          <text className='StatLabel' accessibility-id="profile-points-label">Points</text>
        </view>
      </view>

      <view className='Menu' accessibility-id="profile-menu">
        <view className='MenuItem' bindtap={() => {}} accessibility-id="profile-orders-menu">
          <text className='MenuIcon' accessibility-id="profile-orders-icon">📦</text>
          <text className='MenuText' accessibility-id="profile-orders-text">My Orders</text>
          <text className='MenuArrow' accessibility-id="profile-orders-arrow">›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}} accessibility-id="profile-wishlist-menu">
          <text className='MenuIcon' accessibility-id="profile-wishlist-icon">❤️</text>
          <text className='MenuText' accessibility-id="profile-wishlist-text">Wishlist</text>
          <text className='MenuArrow' accessibility-id="profile-wishlist-arrow">›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}} accessibility-id="profile-settings-menu">
          <text className='MenuIcon' accessibility-id="profile-settings-icon">⚙️</text>
          <text className='MenuText' accessibility-id="profile-settings-text">Settings</text>
          <text className='MenuArrow' accessibility-id="profile-settings-arrow">›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}} accessibility-id="profile-help-menu">
          <text className='MenuIcon' accessibility-id="profile-help-icon">❓</text>
          <text className='MenuText' accessibility-id="profile-help-text">Help & Support</text>
          <text className='MenuArrow' accessibility-id="profile-help-arrow">›</text>
        </view>
      </view>

      <view className='LogoutButton' bindtap={handleLogout} accessibility-id="profile-logout-btn">
        <text className='LogoutButtonText' accessibility-id="profile-logout-btn-text">Logout</text>
      </view>
    </view>
  )
}
