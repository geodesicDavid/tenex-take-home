import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CalendarContainer from '../../../components/layout/CalendarContainer';

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

  it('displays placeholder text when no children are provided', () => {
    renderWithTheme(<CalendarContainer />);
    expect(screen.getByText('Calendar integration will be implemented here.')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childContent = 'Custom calendar content';
    renderWithTheme(<CalendarContainer>{childContent}</CalendarContainer>);
    expect(screen.getByText(childContent)).toBeInTheDocument();
    expect(screen.queryByText('Calendar integration will be implemented here.')).not.toBeInTheDocument();
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