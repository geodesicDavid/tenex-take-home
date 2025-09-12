import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import CalendarEventList from '../CalendarEventList';

interface CalendarContainerProps {
  children?: React.ReactNode;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ children }) => {
  const [daysPreview, setDaysPreview] = useState<number>(3);
  const { events, loading, error, refetch } = useCalendarEvents(daysPreview);

  const handleDaysPreviewChange = (event: SelectChangeEvent<number>) => {
    setDaysPreview(Number(event.target.value));
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        minHeight: { xs: '400px', md: '500px' },
        maxHeight: { xs: '600px', md: '800px' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 0
          }}
        >
          Calendar
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="days-preview-label">Days Preview</InputLabel>
          <Select
            labelId="days-preview-label"
            id="days-preview"
            value={daysPreview}
            label="Days Preview"
            onChange={handleDaysPreviewChange}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
              <MenuItem key={days} value={days}>
                {days} {days === 1 ? 'day' : 'days'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Heavy line separator */}
      <Box sx={{ 
        height: '2px', 
        backgroundColor: 'primary.main', 
        mb: 2 
      }} />
      
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        minHeight: 0,
        // Ensure scrollbar is visible
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