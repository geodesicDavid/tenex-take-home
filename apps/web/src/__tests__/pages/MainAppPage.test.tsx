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

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ authState: mockAuthState }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useThemeContext: () => ({
    themeMode: 'basic',
    setThemeMode: jest.fn()
  }),
  CustomThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock all components that use hooks
jest.mock('../../components/QuickActionsDropdown', () => {
  return function MockQuickActionsDropdown() {
    return <div>Quick Actions Dropdown</div>;
  };
});

jest.mock('../../components/ThemeDropdown', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-dropdown">Theme Dropdown</div>
}));

jest.mock('../../components/layout/ChatContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-container">Chat Container</div>
}));

jest.mock('../../components/layout/CalendarContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="calendar-container">Calendar Container</div>
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
    expect(screen.getByTestId('calendar-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
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

  it('displays mock content in containers', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByTestId('calendar-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
  });
});

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
    expect(screen.getByTestId('calendar-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
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

  it('displays mock content in containers', () => {
    renderWithTheme(<MainAppPage />);
    expect(screen.getByTestId('calendar-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
  });
});