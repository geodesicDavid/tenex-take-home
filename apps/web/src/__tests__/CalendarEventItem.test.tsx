import { render, screen } from '@testing-library/react';
import CalendarEventItem from '../components/CalendarEventItem';
import { CalendarEvent } from '@tenex/shared';

const mockEvent: CalendarEvent = {
  id: '1',
  summary: 'Test Event',
  start_time: new Date('2024-01-01T10:00:00'),
  end_time: new Date('2024-01-01T11:00:00'),
  description: 'Test description'
};

describe('CalendarEventItem', () => {
  it('renders event title', () => {
    render(<CalendarEventItem event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders event date and time', () => {
    render(<CalendarEventItem event={mockEvent} />);
    expect(screen.getByText(/Mon, Jan 1/)).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
  });

  it('renders event description when provided', () => {
    render(<CalendarEventItem event={mockEvent} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const eventWithoutDescription = { ...mockEvent, description: undefined };
    render(<CalendarEventItem event={eventWithoutDescription} />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('handles multi-day events correctly', () => {
    const multiDayEvent = {
      ...mockEvent,
      start_time: new Date('2024-01-01T10:00:00'),
      end_time: new Date('2024-01-02T11:00:00')
    };
    render(<CalendarEventItem event={multiDayEvent} />);
    expect(screen.getByText(/Mon, Jan 1.*Tue, Jan 2/)).toBeInTheDocument();
  });
});