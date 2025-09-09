import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface CalendarContainerProps {
  children?: React.ReactNode;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ children }) => {
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
          color: 'primary.main',
          mb: 2
        }}
      >
        Calendar
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children || (
          <Typography variant="body1" color="text.secondary" align="center">
            Calendar integration will be implemented here.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CalendarContainer;