import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ProviderType = 'openai' | 'gemini' | 'deepseek';

interface ProviderConfig {
  systemPrompt: string;
  messages: ChatMessage[];
}

// OpenAI Provider
async function createOpenAICompletion(config: ProviderConfig): Promise<string> {
  const apiKey = import.meta.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: config.systemPrompt },
      ...config.messages,
    ],
    model: 'gpt-4o-mini',
  });

  return completion.choices[0].message.content || '';
}

// Gemini Provider
async function createGeminiCompletion(config: ProviderConfig): Promise<string> {
  const apiKey = import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Convert messages to Gemini format
  const history = config.messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = config.messages[config.messages.length - 1];

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: config.systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Entendido. Soy el asistente virtual de la UNAG. Estoy listo para ayudar.' }],
      },
      ...history,
    ],
  });

  const result = await chat.sendMessage(lastMessage.content);
  const response = await result.response;
  return response.text();
}

// OpenRouter free tier — race all models in parallel, use fastest successful response
const OPENROUTER_FREE_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
];

async function createDeepSeekCompletion(config: ProviderConfig): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY ?? import.meta.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://portal.unag.edu.hn',
      'X-Title': 'UNAG Portal Chatbot',
    },
  });

  const requests = OPENROUTER_FREE_MODELS.map((model) =>
    client.chat.completions
      .create({
        messages: [
          { role: 'system', content: config.systemPrompt },
          ...config.messages,
        ],
        model,
      })
      .then((completion) => completion.choices[0].message.content || '')
  );

  return Promise.any(requests);
}

// Factory
export const chatProviders: Record<ProviderType, (config: ProviderConfig) => Promise<string>> = {
  openai: createOpenAICompletion,
  gemini: createGeminiCompletion,
  deepseek: createDeepSeekCompletion,
};

export function getChatProvider(provider: ProviderType = 'openai') {
  return chatProviders[provider] || chatProviders.openai;
}
