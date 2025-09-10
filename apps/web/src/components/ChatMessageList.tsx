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

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
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