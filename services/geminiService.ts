import { GoogleGenAI, Chat } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY is not defined in process.env. The app will fail to make requests.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    },
  });
};
