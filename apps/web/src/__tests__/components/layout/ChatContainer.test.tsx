import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatContainer from '../../../components/layout/ChatContainer';

// Mock QuickActionsDropdown
jest.mock('../../../components/QuickActionsDropdown', () => ({
  __esModule: true,
  default: () => <div data-testid="quick-actions-dropdown">Quick Actions Dropdown</div>
}));

// Mock ChatMessageList
jest.mock('../../../components/ChatMessageList', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-message-list">Chat Message List</div>
}));

// Mock ChatComponent
jest.mock('../../../components/ChatComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-component">Chat Component</div>
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ChatContainer', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ChatContainer />);
    expect(screen.getByText('Chat Interface')).toBeInTheDocument();
  });

  it('displays ChatComponent when no children are provided', () => {
    renderWithTheme(<ChatContainer />);
    expect(screen.getByTestId('chat-component')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childContent = 'Custom chat content';
    renderWithTheme(<ChatContainer>{childContent}</ChatContainer>);
    expect(screen.getByText(childContent)).toBeInTheDocument();
    expect(screen.queryByText('Chat interface will be implemented here.')).not.toBeInTheDocument();
  });

  it('has correct structure with Paper component', () => {
    const { container } = renderWithTheme(<ChatContainer />);
    const paperElement = container.querySelector('.MuiPaper-root');
    expect(paperElement).toBeInTheDocument();
  });

  it('has proper typography for title', () => {
    renderWithTheme(<ChatContainer />);
    const titleElement = screen.getByText('Chat Interface');
    expect(titleElement).toHaveClass('MuiTypography-h5');
  });
});