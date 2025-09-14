import { renderHook, act } from '@testing-library/react';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { getCalendarEvents } from '../services/calendarService';
import { CalendarEvent } from '@tenex/shared';

jest.mock('../services/calendarService');

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    summary: 'Test Event',
    start_time: new Date('2024-01-01T10:00:00'),
    end_time: new Date('2024-01-01T11:00:00'),
    description: 'Test description'
  }
];

describe('useCalendarEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to silence error logging in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after tests
    (console.error as jest.Mock).mockRestore();
  });

  it('initializes with loading state', () => {
    (getCalendarEvents as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useCalendarEvents());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('fetches events successfully', async () => {
    (getCalendarEvents as jest.Mock).mockResolvedValue(mockEvents);
    
    const { result } = renderHook(() => useCalendarEvents());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.error).toBe(null);
    expect(getCalendarEvents).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch events';
    (getCalendarEvents as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useCalendarEvents());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('refetches events when refetch is called', async () => {
    (getCalendarEvents as jest.Mock).mockResolvedValue(mockEvents);
    
    const { result } = renderHook(() => useCalendarEvents());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(getCalendarEvents).toHaveBeenCalledTimes(1);
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(getCalendarEvents).toHaveBeenCalledTimes(2);
  });

  it('resets error state on successful refetch', async () => {
    (getCalendarEvents as jest.Mock)
      .mockRejectedValueOnce(new Error('Initial error'))
      .mockResolvedValueOnce(mockEvents);
    
    const { result } = renderHook(() => useCalendarEvents());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.error).toBe('Initial error');
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(result.current.error).toBe(null);
    expect(result.current.events).toEqual(mockEvents);
  });
});