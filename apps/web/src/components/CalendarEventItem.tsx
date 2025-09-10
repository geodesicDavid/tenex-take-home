import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CalendarEvent } from '@tenex/shared';

interface CalendarEventItemProps {
  event: CalendarEvent;
}

const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ event }) => {
  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isSameDay = (start: Date | string, end: Date | string) => {
    return new Date(start).toDateString() === new Date(end).toDateString();
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        mb: 1,
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        '&:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
          {event.summary}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {formatDate(event.start)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {formatTime(event.start)} - {isSameDay(event.start, event.end) ? formatTime(event.end) : `${formatDate(event.end)} ${formatTime(event.end)}`}
        </Typography>
        
        {event.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {event.description}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CalendarEventItem;