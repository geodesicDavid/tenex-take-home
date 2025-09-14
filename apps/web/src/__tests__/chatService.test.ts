import { sendMessage } from '../services/chatService';
import apiClient from '../services/apiClient';

// Mock the apiClient
jest.mock('../services/apiClient');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('chatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends message with correct format', async () => {
    const mockResponse = {
      data: {
        response: 'I hear you.',
        timestamp: '2023-09-10T10:00:00Z',
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await sendMessage('Hello');

    expect(mockApiClient.post).toHaveBeenCalledWith('/chat', {
      message: 'Hello',
      timestamp: expect.any(Date),
    }, {
      withCredentials: true,
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('handles API errors', async () => {
    const errorMessage = 'Network error';
    mockApiClient.post.mockRejectedValue(new Error(errorMessage));

    await expect(sendMessage('Hello')).rejects.toThrow(errorMessage);
  });

  it('sends empty message if provided', async () => {
    const mockResponse = {
      data: {
        response: 'I hear you.',
        timestamp: '2023-09-10T10:00:00Z',
      },
    };

    mockApiClient.post.mockResolvedValue(mockResponse);

    const result = await sendMessage('');

    expect(mockApiClient.post).toHaveBeenCalledWith('/chat', {
      message: '',
      timestamp: expect.any(Date),
    }, {
      withCredentials: true,
    });
    expect(result).toEqual(mockResponse.data);
  });
});