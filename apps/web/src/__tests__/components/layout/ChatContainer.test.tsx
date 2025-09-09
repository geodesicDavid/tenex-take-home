import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatContainer from '../../../components/layout/ChatContainer';

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

  it('displays placeholder text when no children are provided', () => {
    renderWithTheme(<ChatContainer />);
    expect(screen.getByText('Chat interface will be implemented here.')).toBeInTheDocument();
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