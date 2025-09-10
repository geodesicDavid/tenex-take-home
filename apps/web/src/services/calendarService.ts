import apiClient from './apiClient';
import { CalendarEvent } from '@tenex/shared';

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const response = await apiClient.get('/calendar/events');
  return response.data.events;
};