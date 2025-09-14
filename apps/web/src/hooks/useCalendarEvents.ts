import { useState, useEffect, useCallback } from 'react';
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

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCalendarEvents(daysPreview);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
      // Log error silently for debugging
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [daysPreview]);

  useEffect(() => {
    fetchEvents();
  }, [daysPreview, fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};