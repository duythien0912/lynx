import { useCallback, useState, useEffect } from '@lynx-js/react'
import './App.css'

interface Transaction {
  id: string
  amount: number
  type: 'in' | 'out'
  desc: string
  time: string
}

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.()
  }, [])

  const [balance, setBalance] = useState(1250.00)
  const [payAmount, setPayAmount] = useState('25')
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 50, type: 'out', desc: 'Coffee Shop', time: '10:30' },
    { id: '2', amount: 200, type: 'in', desc: 'Refund', time: '09:15' },
    { id: '3', amount: 120, type: 'out', desc: 'Grocery', time: 'Yesterday' },
  ])

  const handlePay = useCallback(() => {
    const amount = parseFloat(payAmount)
    if (amount > 0 && amount <= balance) {
      setBalance(prev => prev - amount)
      setTransactions(prev => [
        { id: Date.now().toString(), amount, type: 'out', desc: 'Payment', time: 'Now' },
        ...prev
      ])
    }
  }, [payAmount, balance])

  const handleAddFunds = useCallback(() => {
    setBalance(prev => prev + 100)
    setTransactions(prev => [
      { id: Date.now().toString(), amount: 100, type: 'in', desc: 'Added Funds', time: 'Now' },
      ...prev
    ])
  }, [])

  const formatAmount = (amount: number) => `$${amount.toFixed(2)}`

  return (
    <view className='Wallet' accessibility-id="wallet-container">
      <view className='Header' accessibility-id="wallet-header">
        <text className='Title' accessibility-id="wallet-title">Wallet</text>
      </view>
      
      <view className='BalanceCard' accessibility-id="wallet-balance-card">
        <text className='BalanceLabel' accessibility-id="wallet-balance-label">Current Balance</text>
        <text className='BalanceAmount' accessibility-id="wallet-balance-amount">{formatAmount(balance)}</text>
      </view>

      <view className='Actions' accessibility-id="wallet-actions">
        <view className='PaySection' accessibility-id="wallet-pay-section">
          <input 
            className='AmountInput'
            type='number'
            placeholder='25'
            accessibility-id="wallet-amount-input"
            bindinput={(e: { detail: { value: string } }) => setPayAmount(e.detail.value)}
          />
          <view className='PayButton' bindtap={handlePay} accessibility-id="wallet-pay-btn">
            <text className='ButtonText' accessibility-id="wallet-pay-btn-text">Pay</text>
          </view>
        </view>
        <view className='AddButton' bindtap={handleAddFunds} accessibility-id="wallet-add-btn">
          <text className='ButtonText' accessibility-id="wallet-add-btn-text">+ $100</text>
        </view>
      </view>

      <text className='SectionTitle' accessibility-id="wallet-transactions-title">Recent Transactions</text>
      <view className='Transactions' accessibility-id="wallet-transactions-list">
        {transactions.map((tx, index) => (
          <view key={tx.id} className='TransactionItem' accessibility-id={`wallet-tx-${index}`}>
            <view className='TxInfo' accessibility-id={`wallet-tx-info-${index}`}>
              <text className='TxDesc' accessibility-id={`wallet-tx-desc-${index}`}>{tx.desc}</text>
              <text className='TxTime' accessibility-id={`wallet-tx-time-${index}`}>{tx.time}</text>
            </view>
            <text className={`TxAmount ${tx.type}`} accessibility-id={`wallet-tx-amount-${index}`}>
              {tx.type === 'in' ? '+' : '-'}{formatAmount(tx.amount)}
            </text>
          </view>
        ))}
      </view>
    </view>
  )
}
