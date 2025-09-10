import { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useChatMessages } from '../hooks/useChatMessages';
import ChatMessageList from './ChatMessageList';

const ChatComponent: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, error, sendUserMessage } = useChatMessages();

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() && !isLoading) {
      await sendUserMessage(inputMessage.trim());
      setInputMessage('');
    }
  }, [inputMessage, isLoading, sendUserMessage]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Message List */}
      <ChatMessageList messages={messages} />

      {/* Error Display */}
      {error && (
        <Paper
          elevation={1}
          sx={{
            mx: 2,
            mb: 2,
            p: 1,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <Typography variant="body2" align="center">
            {error}
          </Typography>
        </Paper>
      )}

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            variant="outlined"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{
              minWidth: 'auto',
              px: 2,
              borderRadius: 2,
              height: '56px',
            }}
          >
            <SendIcon />
          </Button>
        </Box>
        {isLoading && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', textAlign: 'center' }}
          >
            Sending...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatComponent;
export { ChatComponent };