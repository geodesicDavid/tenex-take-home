import { useState, useEffect } from 'react';
import { CalendarEvent } from '@tenex/shared';
import { getCalendarEvents } from '../services/calendarService';

export interface UseCalendarEventsReturn {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCalendarEvents = (daysPreview: number = 3): UseCalendarEventsReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCalendarEvents(daysPreview);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
      console.error('Error fetching calendar events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [daysPreview]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};