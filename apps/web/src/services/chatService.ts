import apiClient from './apiClient';
import { ChatRequest, ChatResponse } from '@tenex/shared';

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const request: ChatRequest = {
    message,
    timestamp: new Date(),
  };
  
  const response = await apiClient.post('/chat', request);
  return response.data;
};

export default {
  sendMessage,
};