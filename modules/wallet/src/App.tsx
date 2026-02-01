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
    <view className='Wallet'>
      <view className='Header'>
        <text className='Title'>Wallet</text>
      </view>
      
      <view className='BalanceCard'>
        <text className='BalanceLabel'>Current Balance</text>
        <text className='BalanceAmount'>{formatAmount(balance)}</text>
      </view>

      <view className='Actions'>
        <view className='PaySection'>
          <input 
            className='AmountInput'
            type='number'
            placeholder='25'
            bindinput={(e: { detail: { value: string } }) => setPayAmount(e.detail.value)}
          />
          <view className='PayButton' bindtap={handlePay}>
            <text className='ButtonText'>Pay</text>
          </view>
        </view>
        <view className='AddButton' bindtap={handleAddFunds}>
          <text className='ButtonText'>+ $100</text>
        </view>
      </view>

      <text className='SectionTitle'>Recent Transactions</text>
      <view className='Transactions'>
        {transactions.map(tx => (
          <view key={tx.id} className='TransactionItem'>
            <view className='TxInfo'>
              <text className='TxDesc'>{tx.desc}</text>
              <text className='TxTime'>{tx.time}</text>
            </view>
            <text className={`TxAmount ${tx.type}`}>
              {tx.type === 'in' ? '+' : '-'}{formatAmount(tx.amount)}
            </text>
          </view>
        ))}
      </view>
    </view>
  )
}
