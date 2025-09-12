import * as React from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { ChatMessage } from '@tenex/shared';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isStreaming = message.isStreaming && !isUser;
  const hasError = message.error && !isUser;
  
  const messageContent = React.useMemo(() => {
    if (isStreaming && message.text) {
      return (
        <Box sx={{ position: 'relative' }}>
          <ReactMarkdown 
            components={{
              p: (props) => (
                <div style={{ marginBottom: '1em', fontFamily: 'inherit', fontSize: '1rem', lineHeight: 1.5 }} {...props}>
                  {props.children}
                </div>
              ),
              ul: ({node, ...props}) => <ul style={{ marginBottom: '1em', paddingLeft: '1.5em' }} {...props} />,
              ol: ({node, ...props}) => <ol style={{ marginBottom: '1em', paddingLeft: '1.5em' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '0.25em' }} {...props} />,
              strong: ({node, ...props}) => <strong style={{ fontWeight: 600 }} {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '8px',
              height: '20px',
              backgroundColor: 'text.primary',
              ml: '2px',
              animation: 'blink 1s infinite',
              '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0 },
              },
            }}
          />
        </Box>
      );
    }
    
    if (message.text) {
      return (
        <ReactMarkdown 
          components={{
            p: (props) => (
              <div style={{ marginBottom: '1em', fontFamily: 'inherit', fontSize: '1rem', lineHeight: 1.5 }} {...props}>
                {props.children}
              </div>
            ),
            ul: ({node, ...props}) => <ul style={{ marginBottom: '1em', paddingLeft: '1.5em' }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ marginBottom: '1em', paddingLeft: '1.5em' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '0.25em' }} {...props} />,
            strong: ({node, ...props}) => <strong style={{ fontWeight: 600 }} {...props} />,
          }}
        >
          {message.text}
        </ReactMarkdown>
      );
    }
    
    return (
      <Typography variant="body1" sx={{ mb: 0.5 }}>
        {hasError ? 'Message failed to send' : ''}
      </Typography>
    );
  }, [message.text, isStreaming, hasError]);

  const getBackgroundColor = () => {
    if (isUser) return 'primary.light';
    if (hasError) return 'error.light';
    if (isStreaming) return 'action.hover';
    return 'grey.100';
  };

  const getTextColor = () => {
    if (isUser) return 'white';
    if (hasError) return 'error.contrastText';
    return 'text.primary';
  };
  
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
              bgcolor: hasError ? 'error.main' : 'secondary.main',
            }}
          >
            {hasError ? '!' : 'AI'}
          </Avatar>
        )}
        
        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            borderBottomRightRadius: isUser ? 0 : 12,
            borderBottomLeftRadius: isUser ? 12 : 0,
            wordBreak: 'break-word',
            position: 'relative',
            opacity: isStreaming ? 0.9 : 1,
            transition: isStreaming ? 'opacity 0.3s ease' : 'none',
          }}
        >
          {messageContent}
          
          {hasError && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 0.5,
                fontStyle: 'italic',
              }}
            >
              Error: {message.error}
            </Typography>
          )}
          
          {!isStreaming && !hasError && (
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                fontSize: '0.75rem',
                display: 'block',
                mt: 0.5,
              }}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </Typography>
          )}
          
          {isStreaming && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <CircularProgress 
                size={12} 
                color="inherit"
                sx={{
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.4 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.4 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  fontSize: '0.7rem',
                }}
              >
                typing...
              </Typography>
            </Box>
          )}
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