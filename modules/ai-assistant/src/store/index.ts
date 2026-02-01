/**
 * AI Assistant Store
 * Global state management for chat
 */

import { useState, useCallback, useEffect } from '@lynx-js/react';
import type { ChatMessage } from '../services/geminiService.js';
import { 
  sendMessageToGemini, 
  createUserMessage, 
  createModelMessage,
  isValidApiKeyFormat,
  GEMINI_MODELS,
} from '../services/geminiService.js';
import {
  getApiKey,
  saveApiKey,
  clearApiKey,
  getSelectedModel,
  saveSelectedModel,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
} from '../utils/storage.js';

export interface AIAssistantState {
  // API
  apiKey: string;
  isApiKeyValid: boolean;
  selectedModel: string;
  
  // Chat
  messages: ChatMessage[];
  inputMessage: string;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  showSettings: boolean;
}

export function createAIStore() {
  // State
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsApiKeyValid(isValidApiKeyFormat(savedKey));
    } else {
      setShowSettings(true);
    }

    const savedModel = getSelectedModel();
    setSelectedModel(savedModel);

    const savedMessages = getChatHistory<ChatMessage>();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages when changed
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Actions
  const updateApiKey = useCallback((key: string) => {
    setApiKey(key);
    setIsApiKeyValid(isValidApiKeyFormat(key));
    setError(null);
  }, []);

  const saveApiKeySettings = useCallback(() => {
    if (isApiKeyValid) {
      saveApiKey(apiKey);
      setShowSettings(false);
      setError(null);
    } else {
      setError('Invalid API key format');
    }
  }, [apiKey, isApiKeyValid]);

  const clearSettings = useCallback(() => {
    clearApiKey();
    setApiKey('');
    setIsApiKeyValid(false);
    setMessages([]);
    clearChatHistory();
    setShowSettings(true);
  }, []);

  const updateSelectedModel = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    saveSelectedModel(modelId);
  }, []);

  const updateInputMessage = useCallback((message: string) => {
    setInputMessage(message);
  }, []);

  const sendMessage = useCallback(async (): Promise<boolean> => {
    if (!inputMessage.trim() || isLoading) return false;
    if (!isApiKeyValid) {
      setError('Please set a valid API key');
      setShowSettings(true);
      return false;
    }

    const userMessage = createUserMessage(inputMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToGemini(
        apiKey,
        [...messages, userMessage],
        selectedModel
      );

      const modelMessage = createModelMessage(responseText);
      setMessages(prev => [...prev, modelMessage]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: `❌ Error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, isApiKeyValid, apiKey, messages, selectedModel]);

  const clearChat = useCallback(() => {
    setMessages([]);
    clearChatHistory();
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    apiKey,
    isApiKeyValid,
    selectedModel,
    messages,
    inputMessage,
    isLoading,
    error,
    showSettings,
    availableModels: GEMINI_MODELS,
    
    // Actions
    updateApiKey,
    saveApiKeySettings,
    clearSettings,
    updateSelectedModel,
    updateInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    dismissError,
  };
}

export type AIStore = ReturnType<typeof createAIStore>;
