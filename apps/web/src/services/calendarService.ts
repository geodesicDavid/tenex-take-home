import apiClient from './apiClient';
import { CalendarEvent } from '@tenex/shared';

export const getCalendarEvents = async (daysPreview: number = 3): Promise<CalendarEvent[]> => {
  const response = await apiClient.get(`/v1/calendar/events?days_ahead=${daysPreview}`);
  return response.data.events;
};