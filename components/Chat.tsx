import React, { useState, useEffect, useRef } from 'react';
import { Chat as GeminiChat, GenerateContentResponse } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession();
      
      // Add a welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: "Hello! I'm Gemini. How can I help you today?",
          timestamp: Date.now(),
        }
      ]);
    } catch (error) {
      console.error("Failed to initialize chat session", error);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    const tempAiId = (Date.now() + 1).toString();
    const tempAiMessage: Message = {
      id: tempAiId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, tempAiMessage]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: text });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
            fullText += chunkText;
            setMessages((prev) => 
                prev.map((msg) => 
                    msg.id === tempAiId 
                        ? { ...msg, text: fullText } 
                        : msg
                )
            );
        }
      }

      // Finalize the message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAiId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAiId
            ? { 
                ...msg, 
                text: "I'm sorry, I encountered an error. Please try again.", 
                isError: true, 
                isStreaming: false 
              }
            : msg
        )
      );
      
      // Refresh session on error to avoid stuck state
      chatSessionRef.current = createChatSession();
      // Optionally replay history to restore context, but simple refresh is safer for recovery
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="flex flex-col min-h-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </>
  );
};

export default Chat;