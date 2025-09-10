import { useState, useCallback } from 'react';
import { ChatMessage } from '@tenex/shared';
import { sendMessage } from '../services/chatService';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendUserMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Omit<ChatMessage, 'id'> = {
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(text.trim());
      
      const agentMessage: Omit<ChatMessage, 'id'> = {
        text: response.response,
        sender: 'agent',
        timestamp: new Date(response.timestamp),
      };
      
      addMessage(agentMessage);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendUserMessage,
    clearMessages,
  };
};

export default useChatMessages;