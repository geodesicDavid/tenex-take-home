import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatComponent from '../components/ChatComponent';
import { useChatMessages } from '../hooks/useChatMessages';

// Mock the useChatMessages hook
jest.mock('../hooks/useChatMessages');

// Mock speech recognition
jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: () => ({
    transcript: '',
    listening: false,
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true,
  }),
  SpeechRecognition: {
    startListening: jest.fn(),
    stopListening: jest.fn(),
  },
}));

// Mock chat service
jest.mock('../services/chatService', () => ({
  sendMessageStreaming: jest.fn(),
}));

// Mock ChatMessageList component
jest.mock('../components/ChatMessageList', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-message-list">Chat Message List</div>,
}));

const mockUseChatMessages = useChatMessages as jest.MockedFunction<typeof useChatMessages>;

describe('ChatComponent', () => {
  const mockSendUserMessage = jest.fn();
  const mockClearMessages = jest.fn();
  const mockAddMessage = jest.fn();
  const mockUpdateMessage = jest.fn();

  beforeEach(() => {
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
      addMessage: mockAddMessage,
      updateMessage: mockUpdateMessage,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface with input and send button', () => {
    render(<ChatComponent />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByTestId('SendIcon')).toBeInTheDocument();
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument();
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
      addMessage: mockAddMessage,
      updateMessage: mockUpdateMessage,
    });

    render(<ChatComponent />);
    
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument();
  });

  it('sends message when send button is clicked', async () => {
    render(<ChatComponent />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByTestId('SendIcon').closest('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton!);

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
    
    const sendButton = screen.getByTestId('SendIcon').closest('button');
    expect(sendButton).toBeDisabled();
  });

  it('disables send button when loading', () => {
    mockUseChatMessages.mockReturnValue({
      messages: [],
      isLoading: true,
      error: null,
      sendUserMessage: mockSendUserMessage,
      clearMessages: mockClearMessages,
      addMessage: mockAddMessage,
      updateMessage: mockUpdateMessage,
    });

    render(<ChatComponent />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByTestId('SendIcon').closest('button');

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
      addMessage: mockAddMessage,
      updateMessage: mockUpdateMessage,
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
      addMessage: mockAddMessage,
      updateMessage: mockUpdateMessage,
    });

    render(<ChatComponent />);
    
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument();
  });
});