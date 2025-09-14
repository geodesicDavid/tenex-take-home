import React, { Fragment } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { CalendarEvent } from '@tenex/shared';
import CalendarEventItem from './CalendarEventItem';

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
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.start_time).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '200px',
        gap: 2
      }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '200px'
      }}>
        <Typography variant="h6" color="text.secondary">
          No upcoming events found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <Fragment key={date}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 1,
                color: 'text.primary'
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
        </Fragment>
      ))}
    </Box>
  );
};

export default CalendarEventList;