import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainAppPage from '../../pages/MainAppPage';
import { AuthProvider } from '../../contexts/AuthContext';

const theme = createTheme();

const mockAuthState = {
  isAuthenticated: true,
  user: { name: 'Test User', email: 'test@example.com' },
  loading: false
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ authState: mockAuthState }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('MainAppPage', () => {
  it('renders without crashing when authenticated', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByText('Tenex Calendar & Chat')).toBeInTheDocument();
  });

  it('displays main title and subtitle', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByText('Tenex Calendar & Chat')).toBeInTheDocument();
    expect(screen.getByText('Manage your schedule and conversations in one place')).toBeInTheDocument();
  });

  it('renders both CalendarContainer and ChatContainer', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Chat Interface')).toBeInTheDocument();
  });

  it('has responsive layout with Grid container', () => {
    const { container } = renderWithTheme(<MainAppPage />);
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });

  it('has two Grid items for calendar and chat', () => {
    const { container } = renderWithTheme(<MainAppPage />);
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems).toHaveLength(2);
  });

  it('displays placeholder content in containers', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByText('Calendar integration will be implemented here.')).toBeInTheDocument();
    expect(screen.getByText('Chat interface will be implemented here.')).toBeInTheDocument();
  });
});