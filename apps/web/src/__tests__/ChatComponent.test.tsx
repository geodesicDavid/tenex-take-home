import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatComponent } from '../ChatComponent';
import { useChatMessages } from '../../hooks/useChatMessages';

// Mock the useChatMessages hook
jest.mock('../../hooks/useChatMessages');

const mockUseChatMessages = useChatMessages as jest.MockedFunction<typeof useChatMessages>;

describe('ChatComponent', () => {
  const mockSendUserMessage = jest.fn();
  const mockClearMessages = jest.fn();

  beforeEach(() => {
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface with input and send button', () => {
    render(<ChatComponent />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
  });

  it('displays messages when they exist', () => {
    const mockMessages = [
      {
        id: '1',
        text: 'Hello',
        sender: 'user' as const,
        timestamp: new Date(),
      },
      {
        id: '2',
        text: 'Hi there!',
        sender: 'agent' as const,
        timestamp: new Date(),
      },
    ];

    mockUseChatMessages.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
    });

    render(<ChatComponent />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('sends message when send button is clicked', async () => {
    render(<ChatComponent />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(mockSendUserMessage).toHaveBeenCalledWith('Test message');
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('sends message when Enter key is pressed', async () => {
    render(<ChatComponent />);
    
    const input = screen.getByPlaceholderText('Type your message...');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockSendUserMessage).toHaveBeenCalledWith('Test message');
  });

  it('disables send button when input is empty', () => {
    render(<ChatComponent />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('disables send button when loading', () => {
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: true,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
    });

    render(<ChatComponent />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(sendButton).toBeDisabled();
  });

  it('displays error message when error exists', () => {
    const errorMessage = 'Test error message';
    
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: false,
      error: errorMessage,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
    });

    render(<ChatComponent />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays loading state when sending message', () => {
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: true,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
    });

    render(<ChatComponent />);
    
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });
});