import { useState, useCallback } from 'react';
import { ChatMessage, StreamingChunk } from '@tenex/shared';
import { sendMessageStreaming } from '../services/chatService';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage> | ((prev: ChatMessage) => Partial<ChatMessage>)) => {
    setMessages(prev => {
      const updatedMessages = prev.map(msg => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            ...(typeof updates === 'function' ? updates(msg) : updates)
          };
          console.log('Updating message:', msg.id, 'with updates:', updates, 'result:', updatedMsg);
          console.log('New text:', updatedMsg.text);
          return updatedMsg;
        }
        return msg;
      });
      return updatedMessages;
    });
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
      const agentMessage: Omit<ChatMessage, 'id'> = {
        text: '',
        sender: 'agent',
        timestamp: new Date(),
        isStreaming: true,
        isComplete: false,
      };

      const agentMessageId = addMessage(agentMessage);

      await sendMessageStreaming(
        text.trim(),
        (chunk: StreamingChunk) => {
          console.log('Received chunk:', chunk);
          console.log('Chunk content:', chunk.content);
          console.log('Chunk isComplete:', chunk.isComplete);
          if (chunk.isComplete) {
            console.log('Completion chunk received, updating message and setting isLoading to false');
            updateMessage(agentMessageId, {
              isStreaming: false,
              isComplete: true,
            });
            setIsLoading(false);
            return;
          }

          if (chunk.content) {
            console.log('Content chunk received, updating message text:', chunk.content);
            updateMessage(agentMessageId, (prev) => ({
              text: prev.text + chunk.content,
            }));
          }
        },
        (err: Error) => {
          console.error('Streaming error:', err);
          updateMessage(agentMessageId, {
            isStreaming: false,
            isComplete: false,
            error: err.message,
          });
          setError('Streaming failed. Please try again.');
          setIsLoading(false);
        }
      );
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
      setIsLoading(false);
    }
  }, [addMessage, updateMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendUserMessage,
    addMessage,
    updateMessage,
    clearMessages,
  };
};

export default useChatMessages;