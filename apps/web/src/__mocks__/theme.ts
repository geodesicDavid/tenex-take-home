export const lightTheme = {
  palette: {
    mode: 'light' as const,
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#000000', secondary: '#666666' }
  },
  spacing: (factor: number) => `${8 * factor}px`
};

export const darkTheme = {
  palette: {
    mode: 'dark' as const,
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0b0b0' }
  },
  spacing: (factor: number) => `${8 * factor}px`
};

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};