/**
 * Stable Network Configuration
 * https://docs.stable.xyz/
 */

export const STABLE_NETWORK = {
  // Mainnet
  mainnet: {
    chainId: 988,
    chainIdHex: '0x3DC',
    name: 'Stable Mainnet',
    rpcUrl: 'https://rpc.stable.xyz',
    wsUrl: 'wss://rpc.stable.xyz',
    blockExplorer: 'https://stablescan.xyz',
    nativeCurrency: {
      name: 'gUSDT',
      symbol: 'gUSDT',
      decimals: 18,
    },
  },
  // Testnet
  testnet: {
    chainId: 2201,
    chainIdHex: '0x899',
    name: 'Stable Testnet',
    rpcUrl: 'https://testnet-rpc.stable.xyz',
    wsUrl: 'wss://testnet-rpc.stable.xyz',
    blockExplorer: 'https://testnet.stablescan.xyz',
    nativeCurrency: {
      name: 'USDT0',
      symbol: 'USDT0',
      decimals: 18,
    },
  },
};

export type NetworkType = 'mainnet' | 'testnet';

export const getNetworkConfig = (network: NetworkType = 'testnet') => {
  return STABLE_NETWORK[network];
};

// Common ERC20 Token Addresses on Stable Network
export const STABLE_TOKENS = {
  testnet: {
    USDT: '0x0000000000000000000000000000000000000000', // Native gas token
    STABLE: '0x0000000000000000000000000000000000000000', // Governance token
  },
  mainnet: {
    USDT: '0x0000000000000000000000000000000000000000', // Native gas token
    STABLE: '0x0000000000000000000000000000000000000000', // Governance token
  },
};

// Minimal ERC20 ABI for token interactions
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];
