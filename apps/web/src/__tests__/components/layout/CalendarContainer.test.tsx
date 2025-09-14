import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CalendarContainer from '../../../components/layout/CalendarContainer';

// Mock the useCalendarEvents hook
jest.mock('../../../hooks/useCalendarEvents', () => ({
  useCalendarEvents: () => ({
    events: [],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// Mock console.error to silence error logging in tests
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
  (console.log as jest.Mock).mockRestore();
});

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('CalendarContainer', () => {
  it('renders without crashing', () => {
    renderWithTheme(<CalendarContainer />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childContent = 'Custom calendar content';
    renderWithTheme(<CalendarContainer>{childContent}</CalendarContainer>);
    expect(screen.getByText(childContent)).toBeInTheDocument();
  });

  it('has correct structure with Paper component', () => {
    const { container } = renderWithTheme(<CalendarContainer />);
    const paperElement = container.querySelector('.MuiPaper-root');
    expect(paperElement).toBeInTheDocument();
  });

  it('has proper typography for title', () => {
    renderWithTheme(<CalendarContainer />);
    const titleElement = screen.getByText('Calendar');
    expect(titleElement).toHaveClass('MuiTypography-h5');
  });
});