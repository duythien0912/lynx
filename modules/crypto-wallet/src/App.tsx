/**
 * Crypto Wallet Mini-App
 * Built on Stable Network (https://www.stable.xyz/)
 * 
 * Features:
 * - Wallet connection
 * - Send/Receive gUSDT
 * - Transaction history
 * - Network switching (Mainnet/Testnet)
 */

import { useState, useEffect } from '@lynx-js/react';
import './App.css';
import { createWalletStore } from './store/index.js';
import { formatAddress } from './services/walletService.js';
import type { NetworkType } from './utils/stableConfig.js';

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.();
  }, []);

  const store = createWalletStore();
  const [sendAmount, setSendAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [activeTab, setActiveTab] = useState<'assets' | 'activity'>('assets');

  const handleConnect = async () => {
    await store.connectWallet();
  };

  const handleDisconnect = () => {
    store.disconnectWallet();
  };

  const handleSend = async () => {
    if (!sendAmount || !sendTo) return;
    const success = await store.sendTransaction(sendTo, sendAmount);
    if (success) {
      setSendAmount('');
      setSendTo('');
    }
  };

  const handleNetworkSwitch = (network: NetworkType) => {
    store.switchNetwork(network);
  };

  // Render connect screen
  if (!store.isConnected) {
    return (
      <view className="WalletContainer" accessibility-id="crypto-wallet-container">
        <view className="ConnectScreen" accessibility-id="connect-screen">
          <view className="LogoSection" accessibility-id="logo-section">
            <view className="WalletIcon" accessibility-id="wallet-icon">🔐</view>
            <text className="AppTitle" accessibility-id="app-title">Stable Wallet</text>
            <text className="AppSubtitle" accessibility-id="app-subtitle">
              Secure Crypto on Stable Network
            </text>
          </view>

          <view className="NetworkSelector" accessibility-id="network-selector">
            <text className="NetworkLabel" accessibility-id="network-label">Select Network</text>
            <view className="NetworkButtons" accessibility-id="network-buttons">
              <view 
                className={`NetworkButton ${store.network === 'testnet' ? 'active' : ''}`}
                bindtap={() => handleNetworkSwitch('testnet')}
                accessibility-id="testnet-button"
              >
                <text className="NetworkButtonText" accessibility-id="testnet-button-text">Testnet</text>
              </view>
              <view 
                className={`NetworkButton ${store.network === 'mainnet' ? 'active' : ''}`}
                bindtap={() => handleNetworkSwitch('mainnet')}
                accessibility-id="mainnet-button"
              >
                <text className="NetworkButtonText" accessibility-id="mainnet-button-text">Mainnet</text>
              </view>
            </view>
          </view>

          <view className="FeaturesList" accessibility-id="features-list">
            <view className="FeatureItem" accessibility-id="feature-1">
              <text className="FeatureIcon" accessibility-id="feature-1-icon">⚡</text>
              <text className="FeatureText" accessibility-id="feature-1-text">Fast Transactions (~0.7s)</text>
            </view>
            <view className="FeatureItem" accessibility-id="feature-2">
              <text className="FeatureIcon" accessibility-id="feature-2-icon">💰</text>
              <text className="FeatureText" accessibility-id="feature-2-text">Low Gas Fees (gUSDT)</text>
            </view>
            <view className="FeatureItem" accessibility-id="feature-3">
              <text className="FeatureIcon" accessibility-id="feature-3-icon">🔒</text>
              <text className="FeatureText" accessibility-id="feature-3-text">Secure & Decentralized</text>
            </view>
          </view>

          <view 
            className={`ConnectButton ${store.isConnecting ? 'loading' : ''}`}
            bindtap={handleConnect}
            accessibility-id="connect-button"
          >
            {store.isConnecting ? (
              <view className="LoadingSpinner" accessibility-id="connect-spinner" />
            ) : (
              <text className="ConnectButtonText" accessibility-id="connect-button-text">
                Create Wallet
              </text>
            )}
          </view>

          {store.error && (
            <text className="ErrorText" accessibility-id="error-text">{store.error}</text>
          )}
        </view>
      </view>
    );
  }

  // Render wallet screen
  return (
    <view className="WalletContainer" accessibility-id="crypto-wallet-container">
      {/* Header */}
      <view className="WalletHeader" accessibility-id="wallet-header">
        <view className="HeaderTop" accessibility-id="header-top">
          <view className="NetworkBadge" accessibility-id="network-badge">
            <view className={`NetworkDot ${store.network}`} accessibility-id="network-dot" />
            <text className="NetworkName" accessibility-id="network-name">
              {store.network === 'mainnet' ? 'Stable Mainnet' : 'Stable Testnet'}
            </text>
          </view>
          <view className="DisconnectButton" bindtap={handleDisconnect} accessibility-id="disconnect-button">
            <text className="DisconnectIcon" accessibility-id="disconnect-icon">🔓</text>
          </view>
        </view>
        
        <view className="AddressSection" accessibility-id="address-section">
          <text className="WalletAddress" accessibility-id="wallet-address">
            {store.account ? formatAddress(store.account.address) : ''}
          </text>
          <text className="AddressFull" accessibility-id="address-full">
            {store.account?.address || ''}
          </text>
        </view>
      </view>

      {/* Balance Card */}
      <view className="BalanceCard" accessibility-id="balance-card">
        <text className="BalanceLabel" accessibility-id="balance-label">Total Balance</text>
        <text className="BalanceAmount" accessibility-id="balance-amount">
          {store.formattedBalance} {store.network === 'mainnet' ? 'gUSDT' : 'USDT0'}
        </text>
        <text className="GasPrice" accessibility-id="gas-price">
          Gas: {store.gasPrice} Gwei
        </text>
      </view>

      {/* Action Buttons */}
      <view className="ActionButtons" accessibility-id="action-buttons">
        <view className="ActionButton" bindtap={() => {}} accessibility-id="receive-button">
          <view className="ActionIcon" accessibility-id="receive-icon">📥</view>
          <text className="ActionText" accessibility-id="receive-text">Receive</text>
        </view>
        <view className="ActionButton" bindtap={() => {}} accessibility-id="send-button">
          <view className="ActionIcon" accessibility-id="send-icon">📤</view>
          <text className="ActionText" accessibility-id="send-text">Send</text>
        </view>
        <view className="ActionButton" bindtap={store.refreshBalance} accessibility-id="refresh-button">
          <view className="ActionIcon" accessibility-id="refresh-icon">🔄</view>
          <text className="ActionText" accessibility-id="refresh-text">Refresh</text>
        </view>
      </view>

      {/* Send Form */}
      <view className="SendForm" accessibility-id="send-form">
        <text className="FormTitle" accessibility-id="send-form-title">Send Tokens</text>
        <input
          className="InputField"
          type="text"
          placeholder="Recipient Address (0x...)"
          value={sendTo}
          bindinput={(e) => setSendTo(e.detail.value)}
          accessibility-id="send-to-input"
        />
        <input
          className="InputField"
          type="number"
          placeholder="Amount"
          value={sendAmount}
          bindinput={(e) => setSendAmount(e.detail.value)}
          accessibility-id="send-amount-input"
        />
        <view className="SendButton" bindtap={handleSend} accessibility-id="send-submit-button">
          <text className="SendButtonText" accessibility-id="send-submit-text">Send Transaction</text>
        </view>
      </view>

      {/* Tabs */}
      <view className="Tabs" accessibility-id="tabs">
        <view 
          className={`Tab ${activeTab === 'assets' ? 'active' : ''}`}
          bindtap={() => setActiveTab('assets')}
          accessibility-id="assets-tab"
        >
          <text className="TabText" accessibility-id="assets-tab-text">Assets</text>
        </view>
        <view 
          className={`Tab ${activeTab === 'activity' ? 'active' : ''}`}
          bindtap={() => setActiveTab('activity')}
          accessibility-id="activity-tab"
        >
          <text className="TabText" accessibility-id="activity-tab-text">Activity</text>
        </view>
      </view>

      {/* Tab Content */}
      <scroll-view className="TabContent" scroll-y accessibility-id="tab-content">
        {activeTab === 'assets' ? (
          <view className="AssetsList" accessibility-id="assets-list">
            <view className="AssetItem" accessibility-id="asset-item">
              <view className="AssetIcon" accessibility-id="asset-icon">💎</view>
              <view className="AssetInfo" accessibility-id="asset-info">
                <text className="AssetName" accessibility-id="asset-name">
                  {store.network === 'mainnet' ? 'gUSDT' : 'USDT0'}
                </text>
                <text className="AssetBalance" accessibility-id="asset-balance">
                  {store.formattedBalance}
                </text>
              </view>
            </view>
          </view>
        ) : (
          <view className="ActivityList" accessibility-id="activity-list">
            {/* Pending Transactions */}
            {store.pendingTransactions.map((tx, index) => (
              <view key={tx.hash} className="TransactionItem pending" accessibility-id={`pending-tx-${index}`}>
                <view className="TxIcon" accessibility-id={`pending-tx-icon-${index}`}>⏳</view>
                <view className="TxInfo" accessibility-id={`pending-tx-info-${index}`}>
                  <text className="TxType" accessibility-id={`pending-tx-type-${index}`}>
                    {tx.from === store.account?.address ? 'Sending' : 'Receiving'}
                  </text>
                  <text className="TxAddress" accessibility-id={`pending-tx-address-${index}`}>
                    {formatAddress(tx.from === store.account?.address ? tx.to : tx.from)}
                  </text>
                </view>
                <text className="TxAmount pending" accessibility-id={`pending-tx-amount-${index}`}>
                  {tx.from === store.account?.address ? '-' : '+'}{tx.value}
                </text>
              </view>
            ))}
            
            {/* Confirmed Transactions */}
            {store.transactions.map((tx, index) => (
              <view key={tx.hash} className="TransactionItem" accessibility-id={`tx-${index}`}>
                <view className="TxIcon" accessibility-id={`tx-icon-${index}`}>
                  {tx.from === store.account?.address ? '📤' : '📥'}
                </view>
                <view className="TxInfo" accessibility-id={`tx-info-${index}`}>
                  <text className="TxType" accessibility-id={`tx-type-${index}`}>
                    {tx.from === store.account?.address ? 'Sent' : 'Received'}
                  </text>
                  <text className="TxAddress" accessibility-id={`tx-address-${index}`}>
                    {formatAddress(tx.from === store.account?.address ? tx.to : tx.from)}
                  </text>
                </view>
                <text className={`TxAmount ${tx.from === store.account?.address ? 'out' : 'in'}`} accessibility-id={`tx-amount-${index}`}>
                  {tx.from === store.account?.address ? '-' : '+'}{tx.value}
                </text>
              </view>
            ))}
          </view>
        )}
      </scroll-view>
    </view>
  );
}
