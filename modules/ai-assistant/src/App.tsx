/**
 * AI Assistant Mini-App
 * Chat with Google Gemini AI
 * 
 * Features:
 * - Enter Gemini API key
 * - Chat interface with message history
 * - Model selection (Flash/Pro)
 * - Persistent chat history
 */

import { useState, useEffect } from '@lynx-js/react';
import './App.css';
import { createAIStore } from './store/index.js';

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.();
  }, []);

  const store = createAIStore();

  // Format timestamp to readable time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render Settings Modal
  if (store.showSettings) {
    return (
      <view className="AIContainer" accessibility-id="ai-assistant-container">
        <view className="SettingsOverlay" accessibility-id="settings-overlay">
          <view className="SettingsCard" accessibility-id="settings-card">
            <view className="SettingsHeader" accessibility-id="settings-header">
              <text className="SettingsTitle" accessibility-id="settings-title">⚙️ Settings</text>
              <text className="SettingsSubtitle" accessibility-id="settings-subtitle">
                Enter your Gemini API Key
              </text>
            </view>

            <view className="SettingsForm" accessibility-id="settings-form">
              <view className="InputGroup" accessibility-id="api-key-group">
                <text className="InputLabel" accessibility-id="api-key-label">
                  Gemini API Key
                </text>
                <input
                  className="InputField"
                  type="password"
                  placeholder="Paste your API key here..."
                  value={store.apiKey}
                  bindinput={(e) => store.updateApiKey(e.detail.value)}
                  accessibility-id="api-key-input"
                />
                <text className="InputHint" accessibility-id="api-key-hint">
                  Get your key at ai.google.dev
                </text>
              </view>

              <view className="InputGroup" accessibility-id="model-group">
                <text className="InputLabel" accessibility-id="model-label">
                  Model
                </text>
                <view className="ModelOptions" accessibility-id="model-options">
                  {store.availableModels.map((model) => (
                    <view
                      key={model.id}
                      className={`ModelOption ${store.selectedModel === model.id ? 'selected' : ''}`}
                      bindtap={() => store.updateSelectedModel(model.id)}
                      accessibility-id={`model-option-${model.id}`}
                    >
                      <text className="ModelName" accessibility-id={`model-name-${model.id}`}>
                        {model.name}
                      </text>
                      <text className="ModelDesc" accessibility-id={`model-desc-${model.id}`}>
                        {model.description}
                      </text>
                    </view>
                  ))}
                </view>
              </view>

              {store.error && (
                <text className="ErrorMessage" accessibility-id="settings-error">
                  {store.error}
                </text>
              )}

              <view
                className={`SaveButton ${!store.isApiKeyValid ? 'disabled' : ''}`}
                bindtap={store.saveApiKeySettings}
                accessibility-id="save-settings-button"
              >
                <text className="SaveButtonText" accessibility-id="save-settings-text">
                  Save & Start Chat
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    );
  }

  // Render Chat Interface
  return (
    <view className="AIContainer" accessibility-id="ai-assistant-container">
      {/* Header */}
      <view className="ChatHeader" accessibility-id="chat-header">
        <view className="HeaderLeft" accessibility-id="header-left">
          <text className="AIIcon" accessibility-id="ai-icon">🤖</text>
          <view className="HeaderInfo" accessibility-id="header-info">
            <text className="AIName" accessibility-id="ai-name">Gemini AI</text>
            <text className="AIModel" accessibility-id="ai-model">
              {store.availableModels.find(m => m.id === store.selectedModel)?.name}
            </text>
          </view>
        </view>
        <view className="HeaderActions" accessibility-id="header-actions">
          <view className="HeaderButton" bindtap={store.clearChat} accessibility-id="clear-chat-button">
            <text className="HeaderButtonIcon" accessibility-id="clear-chat-icon">🗑️</text>
          </view>
          <view className="HeaderButton" bindtap={store.toggleSettings} accessibility-id="settings-button">
            <text className="HeaderButtonIcon" accessibility-id="settings-icon">⚙️</text>
          </view>
        </view>
      </view>

      {/* Error Banner */}
      {store.error && (
        <view className="ErrorBanner" accessibility-id="error-banner">
          <text className="ErrorBannerText" accessibility-id="error-banner-text">{store.error}</text>
          <view className="ErrorBannerClose" bindtap={store.dismissError} accessibility-id="error-close">
            <text>✕</text>
          </view>
        </view>
      )}

      {/* Messages */}
      <scroll-view className="MessagesContainer" scroll-y accessibility-id="messages-container">
        {store.messages.length === 0 ? (
          <view className="EmptyState" accessibility-id="empty-state">
            <text className="EmptyIcon" accessibility-id="empty-icon">💬</text>
            <text className="EmptyTitle" accessibility-id="empty-title">Start a conversation</text>
            <text className="EmptySubtitle" accessibility-id="empty-subtitle">
              Ask me anything!
            </text>
            <view className="Suggestions" accessibility-id="suggestions">
              <view className="SuggestionChip" bindtap={() => {
                store.updateInputMessage('Explain quantum computing');
              }} accessibility-id="suggestion-1">
                <text className="SuggestionText" accessibility-id="suggestion-1-text">Explain quantum computing</text>
              </view>
              <view className="SuggestionChip" bindtap={() => {
                store.updateInputMessage('Write a poem about AI');
              }} accessibility-id="suggestion-2">
                <text className="SuggestionText" accessibility-id="suggestion-2-text">Write a poem about AI</text>
              </view>
              <view className="SuggestionChip" bindtap={() => {
                store.updateInputMessage('Help me debug code');
              }} accessibility-id="suggestion-3">
                <text className="SuggestionText" accessibility-id="suggestion-3-text">Help me debug code</text>
              </view>
            </view>
          </view>
        ) : (
          <view className="MessagesList" accessibility-id="messages-list">
            {store.messages.map((message, index) => (
              <view
                key={message.id}
                className={`Message ${message.role}`}
                accessibility-id={`message-${index}`}
              >
                <view className="MessageAvatar" accessibility-id={`message-avatar-${index}`}>
                  <text className="MessageAvatarIcon" accessibility-id={`message-avatar-icon-${index}`}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </text>
                </view>
                <view className="MessageContent" accessibility-id={`message-content-${index}`}>
                  <view className="MessageHeader" accessibility-id={`message-header-${index}`}>
                    <text className="MessageAuthor" accessibility-id={`message-author-${index}`}>
                      {message.role === 'user' ? 'You' : 'Gemini'}
                    </text>
                    <text className="MessageTime" accessibility-id={`message-time-${index}`}>
                      {formatTime(message.timestamp)}
                    </text>
                  </view>
                  <text className="MessageText" accessibility-id={`message-text-${index}`}>
                    {message.content}
                  </text>
                </view>
              </view>
            ))}
            
            {/* Loading Indicator */}
            {store.isLoading && (
              <view className="LoadingMessage" accessibility-id="loading-message">
                <view className="MessageAvatar" accessibility-id="loading-avatar">
                  <text className="MessageAvatarIcon" accessibility-id="loading-avatar-icon">🤖</text>
                </view>
                <view className="TypingIndicator" accessibility-id="typing-indicator">
                  <view className="TypingDot" accessibility-id="typing-dot-1" />
                  <view className="TypingDot" accessibility-id="typing-dot-2" />
                  <view className="TypingDot" accessibility-id="typing-dot-3" />
                </view>
              </view>
            )}
          </view>
        )}
        <view className="MessagesSpacer" accessibility-id="messages-spacer" />
      </scroll-view>

      {/* Input Area */}
      <view className="InputArea" accessibility-id="input-area">
        <input
          className="MessageInput"
          type="text"
          placeholder="Type your message..."
          value={store.inputMessage}
          bindinput={(e) => store.updateInputMessage(e.detail.value)}
          accessibility-id="message-input"
        />
        <view
          className={`SendButton ${!store.inputMessage.trim() || store.isLoading ? 'disabled' : ''}`}
          bindtap={store.sendMessage}
          accessibility-id="send-button"
        >
          {store.isLoading ? (
            <view className="SendSpinner" accessibility-id="send-spinner" />
          ) : (
            <text className="SendIcon" accessibility-id="send-icon">➤</text>
          )}
        </view>
      </view>
    </view>
  );
}
