import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { ChatMessage } from '@tenex/shared';
import ChatMessageItem from './ChatMessageItem';
import LoadingIndicator from './LoadingIndicator';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && containerRef.current) {
        const container = containerRef.current;
        const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        if (isScrolledToBottom || messages.length === 0) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    scrollToBottom();
  }, [messages]);

  const showLoadingIndicator = isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming;

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No messages yet. Start a conversation!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      {showLoadingIndicator && <LoadingIndicator message="Agent is thinking..." size="small" />}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessageList;