import { renderHook, act } from '@testing-library/react';
import { useChatMessages } from '../useChatMessages';
import { sendMessage } from '../services/chatService';

// Mock the chat service
jest.mock('../services/chatService');
const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;

describe('useChatMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty messages and no error', () => {
    const { result } = renderHook(() => useChatMessages());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds user message and sends it when sendUserMessage is called', async () => {
    const mockResponse = {
      response: 'I hear you.',
      timestamp: new Date(),
    };

    mockSendMessage.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({
      id: expect.any(String),
      text: 'Hello',
      sender: 'user',
      timestamp: expect.any(Date),
    });
    expect(result.current.messages[1]).toEqual({
      id: expect.any(String),
      text: 'I hear you.',
      sender: 'agent',
      timestamp: expect.any(Date),
    });
    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('does not send empty message', async () => {
    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('');
    });

    await act(async () => {
      await result.current.sendUserMessage('   ');
    });

    expect(result.current.messages).toHaveLength(0);
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('sets loading state during message sending', async () => {
    const mockResponse = {
      response: 'I hear you.',
      timestamp: new Date(),
    };

    mockSendMessage.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResponse), 100);
      });
    });

    const { result } = renderHook(() => useChatMessages());

    act(() => {
      result.current.sendUserMessage('Hello');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('sets error when message sending fails', async () => {
    mockSendMessage.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('Hello');
    });

    expect(result.current.error).toBe('Failed to send message. Please try again.');
    expect(result.current.messages).toHaveLength(1); // Only user message
    expect(result.current.messages[0].sender).toBe('user');
  });

  it('clears messages when clearMessages is called', async () => {
    const mockResponse = {
      response: 'I hear you.',
      timestamp: new Date(),
    };

    mockSendMessage.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBe(null);
  });

  it('trims message text before sending', async () => {
    const mockResponse = {
      response: 'I hear you.',
      timestamp: new Date(),
    };

    mockSendMessage.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('  Hello  ');
    });

    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
    expect(result.current.messages[0].text).toBe('Hello');
  });

  it('does not send message when already loading', async () => {
    const mockResponse = {
      response: 'I hear you.',
      timestamp: new Date(),
    };

    mockSendMessage.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResponse), 100);
      });
    });

    const { result } = renderHook(() => useChatMessages());

    act(() => {
      result.current.sendUserMessage('First message');
    });

    expect(result.current.isLoading).toBe(true);

    // Try to send another message while loading
    await act(async () => {
      await result.current.sendUserMessage('Second message');
    });

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith('First message');
  });
});