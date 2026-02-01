/**
 * Gemini API Service
 * https://ai.google.dev/docs
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
}

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Call Gemini API
export const sendMessageToGemini = async (
  apiKey: string,
  messages: ChatMessage[],
  model: string = 'gemini-1.5-flash'
): Promise<string> => {
  if (!apiKey.trim()) {
    throw new Error('API key is required');
  }

  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `HTTP Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to communicate with Gemini API');
  }
};

// Create a new user message
export const createUserMessage = (content: string): ChatMessage => ({
  id: generateId(),
  role: 'user',
  content: content.trim(),
  timestamp: Date.now(),
});

// Create a new model message
export const createModelMessage = (content: string): ChatMessage => ({
  id: generateId(),
  role: 'model',
  content: content.trim(),
  timestamp: Date.now(),
});

// Validate API key format (basic check)
export const isValidApiKeyFormat = (apiKey: string): boolean => {
  return apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
};

// Available models
export const GEMINI_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Advanced reasoning' },
];
