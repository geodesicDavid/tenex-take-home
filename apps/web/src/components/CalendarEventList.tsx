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

  // Group events by date
  const groupedEvents: { [date: string]: CalendarEvent[] } = {};
  events.forEach(event => {
    const dateKey = new Date(event.start_time).toDateString();
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1,
      overflowY: 'auto',
      maxHeight: '100%',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }}>
      {Object.entries(groupedEvents).map(([date, dateEvents], index) => (
        <React.Fragment key={date}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 1,
                position: 'sticky',
                top: 0,
                backgroundColor: 'background.paper',
                zIndex: 1,
                pb: 1
              }}
            >
              {new Date(date).toLocaleDateString([], { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {dateEvents.map((event) => (
                <CalendarEventItem key={event.id} event={event} />
              ))}
            </Box>
          </Box>
          
          {/* Heavy line separator between days (except after the last day) */}
          {index < Object.keys(groupedEvents).length - 1 && (
            <Box sx={{ 
              height: '3px', 
              backgroundColor: 'divider', 
              my: 1 
            }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default CalendarEventList;