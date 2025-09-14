import { render, screen, fireEvent } from '@testing-library/react';
import CalendarEventList from '../components/CalendarEventList';
import { CalendarEvent } from '@tenex/shared';

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    summary: 'Event 1',
    start_time: new Date('2024-01-01T10:00:00'),
    end_time: new Date('2024-01-01T11:00:00'),
    description: 'Description 1'
  },
  {
    id: '2',
    summary: 'Event 2',
    start_time: new Date('2024-01-01T14:00:00'),
    end_time: new Date('2024-01-01T15:00:00'),
    description: 'Description 2'
  }
];

describe('CalendarEventList', () => {
  it('renders loading state', () => {
    render(
      <CalendarEventList 
        events={[]} 
        loading={true} 
        error={null} 
        onRetry={jest.fn()} 
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockRetry = jest.fn();
    render(
      <CalendarEventList 
        events={[]} 
        loading={false} 
        error="Failed to load events" 
        onRetry={mockRetry} 
      />
    );
    expect(screen.getByText('Failed to load events')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls retry function when retry button is clicked', () => {
    const mockRetry = jest.fn();
    render(
      <CalendarEventList 
        events={[]} 
        loading={false} 
        error="Failed to load events" 
        onRetry={mockRetry} 
      />
    );
    fireEvent.click(screen.getByText('Retry'));
    expect(mockRetry).toHaveBeenCalled();
  });

  it('renders empty state when no events', () => {
    render(
      <CalendarEventList 
        events={[]} 
        loading={false} 
        error={null} 
        onRetry={jest.fn()} 
      />
    );
    expect(screen.getByText('No upcoming events found')).toBeInTheDocument();
  });

  it('renders events when provided', () => {
    render(
      <CalendarEventList 
        events={mockEvents} 
        loading={false} 
        error={null} 
        onRetry={jest.fn()} 
      />
    );
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('renders correct number of events', () => {
    render(
      <CalendarEventList 
        events={mockEvents} 
        loading={false} 
        error={null} 
        onRetry={jest.fn()} 
      />
    );
    const eventItems = screen.getAllByRole('article');
    expect(eventItems).toHaveLength(2);
  });
});