import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface ChatContainerProps {
  children?: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
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
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children || (
          <Typography variant="body1" color="text.secondary" align="center">
            Chat interface will be implemented here.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChatContainer;