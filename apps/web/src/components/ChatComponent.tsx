import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton } from '@mui/material';
import { Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { useChatMessages } from '../hooks/useChatMessages';
import ChatMessageList from './ChatMessageList';
import { sendMessageStreaming } from '../services/chatService';
import { ChatMessage, StreamingChunk } from '@tenex/shared';
import { useSpeechRecognition } from 'react-speech-recognition';
import SpeechRecognition from 'react-speech-recognition';

const ChatComponent: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, error, sendUserMessage, addMessage, updateMessage } = useChatMessages();
  const hasSentInitialMessage = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleVoiceInput = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening, resetTranscript]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() && !isLoading) {
      await sendUserMessage(inputMessage.trim());
      setInputMessage('');
      resetTranscript();
      if (listening) {
        SpeechRecognition.stopListening();
      }
    }
  }, [inputMessage, isLoading, sendUserMessage, resetTranscript, listening]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (!hasSentInitialMessage.current && !isLoading && messages.length === 0) {
        hasSentInitialMessage.current = true;
        
        // Create only the agent message to show the response
        const agentMessage: Omit<ChatMessage, 'id'> = {
          text: '',
          sender: 'agent',
          timestamp: new Date(),
          isStreaming: true,
          isComplete: false,
        };

        const agentMessageId = addMessage(agentMessage);

        try {
          await sendMessageStreaming(
            'hello',
            (chunk: StreamingChunk) => {
              if (chunk.isComplete) {
                updateMessage(agentMessageId, {
                  isStreaming: false,
                  isComplete: true,
                });
                return;
              }

              if (chunk.content) {
                updateMessage(agentMessageId, (prev) => ({
                  text: prev.text + chunk.content,
                }));
              }
            },
            (err: Error) => {
              console.error('Initial message streaming error:', err);
              updateMessage(agentMessageId, {
                isStreaming: false,
                isComplete: false,
                error: err.message,
              });
            }
          );
        } catch (err) {
          console.error('Error sending initial message:', err);
          updateMessage(agentMessageId, {
            isStreaming: false,
            isComplete: false,
            error: 'Failed to send initial message.',
          });
        }
      }
    };

    sendInitialMessage();
  }, [isLoading, messages.length, addMessage, updateMessage]);

  
  // Handle quick action events
  useEffect(() => {
    const handleQuickAction = (event: CustomEvent) => {
      const action = event.detail;
      
      // Send the message directly without setting input state first
      sendUserMessage(action);
    };

    window.addEventListener('quick-action', handleQuickAction as EventListener);
    
    return () => {
      window.removeEventListener('quick-action', handleQuickAction as EventListener);
    };
  }, [sendUserMessage]);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Message List */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', // Changed from 'hidden' to 'auto' to allow scrolling
        minHeight: 0
      }}>
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </Box>

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
          {browserSupportsSpeechRecognition ? (
            <IconButton
              onClick={handleVoiceInput}
              color={listening ? 'error' : 'primary'}
              disabled={isLoading}
              sx={{
                minWidth: 'auto',
                borderRadius: 2,
                height: '56px',
                width: '56px',
              }}
            >
              {listening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          ) : null}
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
      </Box>
    </Box>
  );
};

export default ChatComponent;