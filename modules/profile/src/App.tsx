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
      <view className='Profile'>
        <view className='LoginContainer'>
          <text className='LoginTitle'>Welcome Back</text>
          <text className='LoginSubtitle'>Sign in to access your profile</text>
          <view className='LoginButton' bindtap={handleLogin}>
            <text className='ButtonText'>Login</text>
          </view>
        </view>
      </view>
    )
  }

  return (
    <view className='Profile'>
      <view className='Header'>
        <text className='Title'>Profile</text>
        <text className='LogoutText' bindtap={handleLogout}>Logout</text>
      </view>

      <view className='ProfileCard'>
        <view className='Avatar'>
          <text className='AvatarText'>{user.name.charAt(0)}</text>
        </view>
        <text className='UserName'>{user.name}</text>
        <text className='UserEmail'>{user.email}</text>
        <text className='MemberSince'>Member since {user.memberSince}</text>
      </view>

      <view className='StatsRow'>
        <view className='StatItem'>
          <text className='StatValue'>{user.orders}</text>
          <text className='StatLabel'>Orders</text>
        </view>
        <view className='StatDivider' />
        <view className='StatItem'>
          <text className='StatValue'>{user.points}</text>
          <text className='StatLabel'>Points</text>
        </view>
      </view>

      <view className='Menu'>
        <view className='MenuItem' bindtap={() => {}}>
          <text className='MenuIcon'>📦</text>
          <text className='MenuText'>My Orders</text>
          <text className='MenuArrow'>›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}}>
          <text className='MenuIcon'>❤️</text>
          <text className='MenuText'>Wishlist</text>
          <text className='MenuArrow'>›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}}>
          <text className='MenuIcon'>⚙️</text>
          <text className='MenuText'>Settings</text>
          <text className='MenuArrow'>›</text>
        </view>
        <view className='MenuItem' bindtap={() => {}}>
          <text className='MenuIcon'>❓</text>
          <text className='MenuText'>Help & Support</text>
          <text className='MenuArrow'>›</text>
        </view>
      </view>

      <view className='LogoutButton' bindtap={handleLogout}>
        <text className='LogoutButtonText'>Logout</text>
      </view>
    </view>
  )
}
