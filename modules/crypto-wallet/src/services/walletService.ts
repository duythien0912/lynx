/**
 * Wallet Service for Stable Network
 * Handles wallet creation, connection, and transactions
 */

import { getNetworkConfig, NetworkType } from '../utils/stableConfig.js';

export interface WalletAccount {
  address: string;
  privateKey?: string;
  balance: string;
  network: NetworkType;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

// Generate a mock wallet address (for demo purposes)
export const generateWallet = (): WalletAccount => {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16);
  const address = '0x' + Array(40).fill(0).map(randomHex).join('');
  
  return {
    address,
    balance: '0.00',
    network: 'testnet',
  };
};

// Format address for display (0x1234...5678)
export const formatAddress = (address: string, chars = 4): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Format balance with decimals
export const formatBalance = (balance: string, decimals = 4): string => {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

// Convert gUSDT to wei (18 decimals)
export const toWei = (amount: string): string => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  return (num * 1e18).toString();
};

// Convert wei to gUSDT
export const fromWei = (wei: string): string => {
  const num = parseFloat(wei);
  if (isNaN(num)) return '0';
  return (num / 1e18).toString();
};

// Mock transaction history
export const getMockTransactions = (address: string): Transaction[] => {
  return [
    {
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: address,
      to: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      value: '1.5',
      gasPrice: '20000000000',
      gasLimit: '21000',
      nonce: 0,
      status: 'confirmed',
      timestamp: Date.now() - 86400000,
    },
    {
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      to: address,
      value: '0.5',
      gasPrice: '20000000000',
      gasLimit: '21000',
      nonce: 1,
      status: 'confirmed',
      timestamp: Date.now() - 172800000,
    },
  ];
};

// RPC Call helper
export const rpcCall = async (method: string, params: unknown[] = [], network: NetworkType = 'testnet'): Promise<unknown> => {
  const config = getNetworkConfig(network);
  
  try {
    const response = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('RPC call failed:', error);
    return null;
  }
};

// Get balance from network
export const getBalance = async (address: string, network: NetworkType = 'testnet'): Promise<string> => {
  try {
    const result = await rpcCall('eth_getBalance', [address, 'latest'], network);
    if (result) {
      return fromWei(result as string);
    }
  } catch (error) {
    console.error('Failed to get balance:', error);
  }
  
  // Return mock balance for demo
  return (Math.random() * 100).toFixed(4);
};

// Get gas price
export const getGasPrice = async (network: NetworkType = 'testnet'): Promise<string> => {
  try {
    const result = await rpcCall('eth_gasPrice', [], network);
    if (result) {
      return fromWei(result as string);
    }
  } catch (error) {
    console.error('Failed to get gas price:', error);
  }
  
  // Return mock gas price
  return '0.00000002';
};
