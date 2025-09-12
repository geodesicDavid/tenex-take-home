import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ChatComponent from '../ChatComponent';
import QuickActionsDropdown from '../QuickActionsDropdown';

interface ChatContainerProps {
  children?: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '100%',
        minHeight: { xs: '400px', md: '500px' },
        maxHeight: { xs: '600px', md: '800px' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              color: 'secondary.main',
            }}
          >
            Chat Interface
          </Typography>
          <QuickActionsDropdown onActionSelect={(action) => {
            // This will be handled by the ChatComponent
            const event = new CustomEvent('quick-action', { detail: action });
            window.dispatchEvent(event);
          }} />
        </Box>
      </Box>
      
<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children || <ChatComponent />}
      </Box>
    </Paper>
  );
};

export default ChatContainer;