import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import CalendarEventList from '../CalendarEventList';

interface CalendarContainerProps {
  children?: React.ReactNode;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ children }) => {
  const { events, loading, error, refetch } = useCalendarEvents();

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
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {children ? (
          children
        ) : (
          <CalendarEventList 
            events={events} 
            loading={loading} 
            error={error} 
            onRetry={refetch} 
          />
        )}
      </Box>
    </Paper>
  );
};

export default CalendarContainer;