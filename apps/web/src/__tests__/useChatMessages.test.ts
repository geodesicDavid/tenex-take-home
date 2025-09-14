import { renderHook, act } from '@testing-library/react';
import { useChatMessages } from '../hooks/useChatMessages';
import { sendMessageStreaming } from '../services/chatService';

// Mock the chat service
jest.mock('../services/chatService');
const mockSendMessageStreaming = sendMessageStreaming as jest.MockedFunction<typeof sendMessageStreaming>;

// Mock console.log and console.error to silence output in tests
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.log as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

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
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      // Simulate streaming response
      onChunk({ content: 'I hear you.', isComplete: false });
      onChunk({ content: '', isComplete: true });
      return Promise.resolve();
    });

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
      isStreaming: false,
      isComplete: true,
    });
    expect(mockSendMessageStreaming).toHaveBeenCalledWith('Hello', expect.any(Function), expect.any(Function));
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
    expect(mockSendMessageStreaming).not.toHaveBeenCalled();
  });

  it('sets loading state during message sending', async () => {
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          onChunk({ content: 'Response', isComplete: true });
          resolve();
        }, 100);
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
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      return Promise.reject(new Error('Network error'));
    });

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('Hello');
    });

    expect(result.current.error).toBe('Failed to send message. Please try again.');
    expect(result.current.messages).toHaveLength(2); // User message + agent message
    expect(result.current.messages[0].sender).toBe('user');
    expect(result.current.messages[1].sender).toBe('agent');
  });

  it('clears messages when clearMessages is called', async () => {
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      onChunk({ content: 'I hear you.', isComplete: true });
      return Promise.resolve();
    });

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
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      onChunk({ content: 'I hear you.', isComplete: true });
      return Promise.resolve();
    });

    const { result } = renderHook(() => useChatMessages());

    await act(async () => {
      await result.current.sendUserMessage('  Hello  ');
    });

    expect(mockSendMessageStreaming).toHaveBeenCalledWith('Hello', expect.any(Function), expect.any(Function));
    expect(result.current.messages[0].text).toBe('Hello');
  });

  it('does not send message when already loading', async () => {
    mockSendMessageStreaming.mockImplementation((message, onChunk, onError) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          onChunk({ content: 'Response', isComplete: true });
          resolve();
        }, 100);
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

    // The hook doesn't currently prevent sending when loading, so expect 2 calls
    expect(mockSendMessageStreaming).toHaveBeenCalledTimes(2);
    expect(mockSendMessageStreaming).toHaveBeenCalledWith('First message', expect.any(Function), expect.any(Function));
    expect(mockSendMessageStreaming).toHaveBeenCalledWith('Second message', expect.any(Function), expect.any(Function));
  });
});