/**
 * Crypto Wallet Store
 * Global state management for wallet
 */

import { useState, useCallback, useEffect } from '@lynx-js/react';
import type { WalletAccount, Transaction } from '../services/walletService.js';
import { 
  generateWallet, 
  getBalance, 
  getGasPrice, 
  getMockTransactions,
  formatBalance,
} from '../services/walletService.js';
import type { NetworkType } from '../utils/stableConfig.js';

export interface WalletState {
  // Wallet
  account: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Network
  network: NetworkType;
  chainId: number;
  
  // Balance
  balance: string;
  gasPrice: string;
  
  // Transactions
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  
  // UI
  error: string | null;
}

export function createWalletStore() {
  // State
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<NetworkType>('testnet');
  const [balance, setBalance] = useState('0.00');
  const [gasPrice, setGasPrice] = useState('0.00');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Generate a new wallet for demo
      const wallet = generateWallet();
      wallet.network = network;
      
      // Fetch balance
      const bal = await getBalance(wallet.address, network);
      wallet.balance = bal;
      
      setAccount(wallet);
      setIsConnected(true);
      setBalance(bal);
      
      // Load transactions
      const txs = getMockTransactions(wallet.address);
      setTransactions(txs);
      
      // Fetch gas price
      const gas = await getGasPrice(network);
      setGasPrice(gas);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [network]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0.00');
    setTransactions([]);
    setPendingTransactions([]);
    setError(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!account) return;
    
    try {
      const bal = await getBalance(account.address, network);
      setBalance(bal);
      setAccount(prev => prev ? { ...prev, balance: bal } : null);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [account, network]);

  const switchNetwork = useCallback(async (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
    if (account) {
      await refreshBalance();
    }
  }, [account, refreshBalance]);

  const sendTransaction = useCallback(async (to: string, value: string): Promise<boolean> => {
    if (!account) return false;
    
    try {
      // Create pending transaction
      const pendingTx: Transaction = {
        hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        from: account.address,
        to,
        value,
        gasPrice: '20000000000',
        gasLimit: '21000',
        nonce: transactions.length,
        status: 'pending',
        timestamp: Date.now(),
      };
      
      setPendingTransactions(prev => [pendingTx, ...prev]);
      
      // Simulate transaction confirmation
      setTimeout(() => {
        setPendingTransactions(prev => prev.filter(tx => tx.hash !== pendingTx.hash));
        setTransactions(prev => [{ ...pendingTx, status: 'confirmed' }, ...prev]);
        refreshBalance();
      }, 3000);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      return false;
    }
  }, [account, transactions.length, refreshBalance]);

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      refreshBalance();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, refreshBalance]);

  return {
    // State
    account,
    isConnected,
    isConnecting,
    network,
    balance,
    gasPrice,
    transactions,
    pendingTransactions,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchNetwork,
    sendTransaction,
    
    // Helpers
    formattedBalance: formatBalance(balance),
  };
}

export type WalletStore = ReturnType<typeof createWalletStore>;
