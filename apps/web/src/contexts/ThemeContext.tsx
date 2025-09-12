import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'basic' | 'dark' | 'pride';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    return saved || 'basic';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
    
    // Update body class for themes
    document.body.classList.remove('dark-mode', 'pride-mode');
    
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (themeMode === 'pride') {
      document.body.classList.add('pride-mode');
    }
  }, [themeMode]);

  const createCustomTheme = (mode: ThemeMode): Theme => {
    if (mode === 'dark') {
      return createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#bb86fc',
            light: '#e2d4ff',
            dark: '#8b5bd6',
          },
          secondary: {
            main: '#990964',
            light: '#d6118f',
            dark: '#6a0644',
          },
          background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
          },
          text: {
            primary: '#e1e1e1',
            secondary: '#a0a0a0',
            disabled: '#666666',
          },
          divider: '#333333',
          action: {
            active: '#ffffff',
            hover: '#2a2a2a',
            selected: '#333333',
            disabled: '#555555',
            disabledBackground: '#1a1a1a',
          },
          error: {
            main: '#cf6679',
            light: '#ff8a9b',
            dark: '#a03d56',
          },
          warning: {
            main: '#ffb74d',
            light: '#ffe97d',
            dark: '#c5872e',
          },
          success: {
            main: '#81c995',
            light: '#b2f5c3',
            dark: '#5ea274',
          },
          info: {
            main: '#64b5f6',
            light: '#9be7ff',
            dark: '#4682b4',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      });
    } else if (mode === 'pride') {
      return createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#E40303', // Red
            light: '#FF6B6B',
            dark: '#B71C1C',
          },
          secondary: {
            main: '#FF8C00', // Orange
            light: '#FFAB40',
            dark: '#E65100',
          },
          background: {
            default: '#FEFEFE',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#333333',
            secondary: '#666666',
            disabled: '#999999',
          },
          divider: '#EEEEEE',
          action: {
            active: '#E40303',
            hover: '#FFE5E5',
            selected: '#FFF3E0',
            disabled: '#CCCCCC',
            disabledBackground: '#F5F5F5',
          },
          error: {
            main: '#D32F2F',
            light: '#FF6659',
            dark: '#9A0007',
          },
          warning: {
            main: '#F57C00',
            light: '#FFAB40',
            dark: '#E65100',
          },
          success: {
            main: '#388E3C',
            light: '#66BB6A',
            dark: '#1B5E20',
          },
          info: {
            main: '#1976D2',
            light: '#42A5F5',
            dark: '#0D47A1',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(45deg, rgba(228, 3, 3, 0.1), rgba(255, 140, 0, 0.1), rgba(255, 237, 0, 0.1), rgba(0, 128, 38, 0.1), rgba(0, 77, 255, 0.1), rgba(117, 7, 135, 0.1))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(45deg, rgba(228, 3, 3, 0.1), rgba(255, 140, 0, 0.1), rgba(255, 237, 0, 0.1), rgba(0, 128, 38, 0.1), rgba(0, 77, 255, 0.1), rgba(117, 7, 135, 0.1))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              },
              containedPrimary: {
                background: 'linear-gradient(45deg, #E40303, #FF8C00, #FFED00, #008026, #004DFF, #750787)',
                backgroundSize: '300% 300%',
                animation: 'prideGradient 3s ease infinite',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: 'linear-gradient(90deg, #E40303, #FF8C00, #FFED00, #008026, #004DFF, #750787)',
                backgroundSize: '200% 100%',
                animation: 'prideSlide 10s linear infinite',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              },
            },
          },
        },
        typography: {
          h1: {
            background: 'linear-gradient(45deg, #E40303, #FF8C00, #FFED00, #008026, #004DFF, #750787)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'prideGradient 3s ease infinite',
          },
          h2: {
            color: '#750787', // Deep purple for Calendar and Chat Interface titles
            fontWeight: 600,
          },
          h3: {
            color: '#E40303',
          },
          h4: {
            color: '#FF8C00',
          },
          h5: {
            color: '#FFED00',
          },
          h6: {
            color: '#008026',
          },
        },
      });
    } else {
      return createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#990964',
            light: '#990964',
            dark: '#6a0644',
          },
          secondary: {
            main: '#212121',
            light: '#424242',
            dark: '#000000',
          },
          background: {
            default: '#ffffff',
            paper: '#fafafa',
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
            disabled: '#bdbdbd',
          },
          divider: '#e0e0e0',
          action: {
            active: '#212121',
            hover: '#f5f5f5',
            selected: '#e8f5e9',
            disabled: '#bdbdbd',
            disabledBackground: '#f5f5f5',
          },
          error: {
            main: '#d32f2f',
            light: '#ff6659',
            dark: '#9a0007',
          },
          warning: {
            main: '#f57c00',
            light: '#ffab40',
            dark: '#e65100',
          },
          success: {
            main: '#388e3c',
            light: '#66bb6a',
            dark: '#1b5e20',
          },
          info: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#0d47a1',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      });
    }
  };

  const theme = createCustomTheme(themeMode);

  const value: ThemeContextType = {
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};