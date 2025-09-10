import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Agent is thinking...', 
  size = 'medium' 
}) => {
  
  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 40;
      default: return 28;
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        py: 2,
        px: 2,
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress 
        size={getSize()} 
        color="primary"
        aria-label="Loading indicator"
      />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          fontStyle: 'italic',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;