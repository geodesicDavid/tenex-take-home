import apiClient from './apiClient';
import { ChatRequest, ChatResponse, StreamingChunk } from '@tenex/shared';

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const request: ChatRequest = {
    message,
    timestamp: new Date(),
  };
  
  const response = await apiClient.post('/chat', request, {
    withCredentials: true,
  });
  return response.data;
};

export const sendMessageStreaming = async (
  message: string,
  onChunk: (chunk: StreamingChunk) => void,
  onError?: (error: Error) => void,
): Promise<void> => {
  try {
    const request: ChatRequest = {
      message,
      timestamp: new Date(),
    };
    
    const response = await fetch('/api/chat/stream-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Streaming not supported');
    }

    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onChunk({
                id: '',
                content: '',
                isComplete: true,
              });
              return;
            }
            
            try {
              const parsedChunk = JSON.parse(data);
              console.log('Parsed chunk:', parsedChunk);
              onChunk(parsedChunk);
            } catch (parseError) {
              console.error('Error parsing streaming chunk:', parseError);
              console.log('Raw data that failed to parse:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Streaming error:', error);
    if (onError) {
      onError(error as Error);
    } else {
      throw error;
    }
  }
};

export default {
  sendMessage,
  sendMessageStreaming,
};