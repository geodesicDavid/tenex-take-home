import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CalendarEvent } from '@tenex/shared';

interface CalendarEventItemProps {
  event: CalendarEvent;
}

const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ event }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

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

  const isEventCurrentlyHappening = () => {
    const now = currentTime;
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    return now >= startTime && now <= endTime;
  };

  const getNonSelfGuests = () => {
    if (!event.attendees || event.attendees.length === 0) {
      return [];
    }
    
    return event.attendees
      .filter(attendee => !attendee.self)
      .map(attendee => attendee.displayName ? `${attendee.displayName} (${attendee.email})` : attendee.email)
      .slice(0, 5); // Limit to first 5 guests
  };

  const isCurrentlyHappening = isEventCurrentlyHappening();
  const nonSelfGuests = getNonSelfGuests();

  return (
    <Paper 
      elevation={isCurrentlyHappening ? 3 : 1}
      sx={{ 
        p: 2, 
        mb: 1,
        borderLeft: '4px solid',
        borderLeftColor: isCurrentlyHappening ? 'success.main' : 'primary.main',
        backgroundColor: isCurrentlyHappening ? 'success.light' : 'background.paper',
        '&:hover': {
          backgroundColor: isCurrentlyHappening ? 'success.light' : 'action.hover',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {event.summary}
          </Typography>
          {isCurrentlyHappening && (
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: 'success.main', 
                color: 'white', 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            >
              LIVE
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {formatDate(event.start_time)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {formatTime(event.start_time)} - {isSameDay(event.start_time, event.end_time) ? formatTime(event.end_time) : `${formatDate(event.end_time)} ${formatTime(event.end_time)}`}
        </Typography>
        
        {event.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {event.description}
          </Typography>
        )}
        
        {nonSelfGuests.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Guests:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nonSelfGuests.join(', ')}
              {event.attendees && event.attendees.filter(a => !a.self).length > 5 && (
                <span style={{ marginLeft: '4px' }}>
                  (+{event.attendees.filter(a => !a.self).length - 5} more)
                </span>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CalendarEventItem;