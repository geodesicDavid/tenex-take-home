import React from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import CalendarEventItem from './CalendarEventItem';
import { CalendarEvent } from '@tenex/shared';

interface CalendarEventListProps {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ 
  events, 
  loading, 
  error, 
  onRetry 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No upcoming events found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1,
      overflowY: 'auto',
      maxHeight: '100%',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0, 0, 0, 0.3)',
      },
    }}>
      {events.map((event) => (
        <CalendarEventItem key={event.id} event={event} />
      ))}
    </Box>
  );
};

export default CalendarEventList;