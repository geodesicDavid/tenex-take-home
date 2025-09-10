import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ChatComponent from '../ChatComponent';

interface ChatContainerProps {
  children?: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'secondary.main',
            mb: 2
          }}
        >
          Chat Interface
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children || <ChatComponent />}
      </Box>
    </Paper>
  );
};

export default ChatContainer;