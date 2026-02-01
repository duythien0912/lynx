import { useCallback, useState, useEffect } from '@lynx-js/react'
import './App.css'

interface Product {
  id: string
  name: string
  price: number
  emoji: string
}

interface CartItem {
  product: Product
  quantity: number
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 99.99, emoji: '🎧' },
  { id: '2', name: 'Smart Watch', price: 249.99, emoji: '⌚' },
  { id: '3', name: 'Portable Charger', price: 39.99, emoji: '🔋' },
  { id: '4', name: 'Bluetooth Speaker', price: 79.99, emoji: '🔊' },
]

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.()
  }, [])

  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const buyNow = useCallback((product: Product) => {
    addToCart(product)
    setSelectedProduct(null)
  }, [addToCart])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (selectedProduct) {
    return (
      <view className='Shop'>
        <view className='Header'>
          <text className='BackButton' bindtap={() => setSelectedProduct(null)}>← Back</text>
        </view>
        <view className='ProductDetail'>
          <text className='ProductEmoji'>{selectedProduct.emoji}</text>
          <text className='ProductName'>{selectedProduct.name}</text>
          <text className='ProductPrice'>{formatPrice(selectedProduct.price)}</text>
          <view className='DetailActions'>
            <view className='AddToCartButton' bindtap={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
              <text className='ButtonText'>Add to Cart</text>
            </view>
            <view className='BuyNowButton' bindtap={() => buyNow(selectedProduct)}>
              <text className='ButtonText'>Buy Now</text>
            </view>
          </view>
        </view>
      </view>
    )
  }

  return (
    <view className='Shop'>
      <view className='Header'>
        <text className='Title'>Shop</text>
        <view className='CartBadge'>
          <text className='CartCount'>{cartCount}</text>
        </view>
      </view>

      <view className='ProductGrid'>
        {PRODUCTS.map(product => (
          <view key={product.id} className='ProductCard' bindtap={() => setSelectedProduct(product)}>
            <text className='ProductCardEmoji'>{product.emoji}</text>
            <text className='ProductCardName'>{product.name}</text>
            <text className='ProductCardPrice'>{formatPrice(product.price)}</text>
          </view>
        ))}
      </view>

      {cart.length > 0 && (
        <view className='CartBar'>
          <text className='CartTotal'>Total: {formatPrice(cartTotal)}</text>
          <view className='CheckoutButton' bindtap={() => {}}>
            <text className='ButtonText'>Checkout ({cartCount})</text>
          </view>
        </view>
      )}
    </view>
  )
}
