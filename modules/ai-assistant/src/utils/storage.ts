/**
 * Storage utilities for AI Assistant
 */

const STORAGE_KEYS = {
  API_KEY: 'ai_assistant_api_key',
  CHAT_HISTORY: 'ai_assistant_chat_history',
  SELECTED_MODEL: 'ai_assistant_selected_model',
};

// Save API key
export const saveApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  } catch (error) {
    console.error('Failed to save API key:', error);
  }
};

// Get API key
export const getApiKey = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
};

// Clear API key
export const clearApiKey = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Failed to clear API key:', error);
  }
};

// Save selected model
export const saveSelectedModel = (modelId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  } catch (error) {
    console.error('Failed to save selected model:', error);
  }
};

// Get selected model
export const getSelectedModel = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-1.5-flash';
  } catch (error) {
    console.error('Failed to get selected model:', error);
    return 'gemini-1.5-flash';
  }
};

// Save chat history
export const saveChatHistory = <T>(messages: T[]): void => {
  try {
    const serialized = JSON.stringify(messages);
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, serialized);
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

// Get chat history
export const getChatHistory = <T>(): T[] => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (!serialized) return [];
    return JSON.parse(serialized) as T[];
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
};

// Clear chat history
export const clearChatHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};
