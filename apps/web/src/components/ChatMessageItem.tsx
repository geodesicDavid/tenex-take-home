import * as React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { ChatMessage } from '@tenex/shared';
import { format } from 'date-fns';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          maxWidth: '70%',
          gap: 1,
        }}
      >
        {!isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'secondary.main',
            }}
          >
            AI
          </Avatar>
        )}
        
        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: isUser ? 'primary.light' : 'grey.100',
            color: isUser ? 'white' : 'text.primary',
            borderBottomRightRadius: isUser ? 0 : 12,
            borderBottomLeftRadius: isUser ? 12 : 0,
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1" sx={{ mb: 0.5 }}>
            {message.text}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.8,
              fontSize: '0.75rem',
            }}
          >
            {format(new Date(message.timestamp), 'HH:mm')}
          </Typography>
        </Paper>
        
        {isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
            }}
          >
            U
          </Avatar>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessageItem;