import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'basic' | 'dark' | 'pride' | 'forest' | 'metallic';

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
    document.body.classList.remove('dark-mode', 'pride-mode', 'forest-mode', 'metallic-mode');
    
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (themeMode === 'pride') {
      document.body.classList.add('pride-mode');
    } else if (themeMode === 'forest') {
      document.body.classList.add('forest-mode');
    } else if (themeMode === 'metallic') {
      document.body.classList.add('metallic-mode');
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
    } else if (mode === 'forest') {
      return createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#2E7D32', // Deep forest green
            light: '#4CAF50',
            dark: '#1B5E20',
          },
          secondary: {
            main: '#6D4C41', // Earth brown
            light: '#8D6E63',
            dark: '#4E342E',
          },
          background: {
            default: '#F1F8E9', // Light forest green background
            paper: '#FFFFFF',
          },
          text: {
            primary: '#2E7D32', // Deep forest green
            secondary: '#5D4037', // Dark brown
            disabled: '#A1887F',
          },
          divider: '#C8A882', // Sandy brown
          action: {
            active: '#2E7D32',
            hover: '#E8F5E9',
            selected: '#C8E6C9',
            disabled: '#BCAAA4',
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
            main: '#2E7D32',
            light: '#4CAF50',
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
                backgroundImage: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(109, 76, 65, 0.05))',
                boxShadow: '0 3px 10px rgba(46, 125, 50, 0.15)',
                border: '1px solid rgba(109, 76, 65, 0.1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(109, 76, 65, 0.05))',
                boxShadow: '0 3px 10px rgba(46, 125, 50, 0.15)',
                border: '1px solid rgba(109, 76, 65, 0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
              },
              containedPrimary: {
                background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
                boxShadow: '0 3px 8px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #388E3C, #66BB6A)',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                },
              },
              outlinedPrimary: {
                borderColor: '#2E7D32',
                color: '#2E7D32',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#4CAF50',
                  backgroundColor: 'rgba(46, 125, 50, 0.05)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: 'linear-gradient(90deg, #2E7D32, #4CAF50, #81C784)',
                boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: '#5D4037',
                fontWeight: 500,
              },
              selected: {
                color: '#2E7D32',
                fontWeight: 600,
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                backgroundColor: '#2E7D32',
                height: '3px',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                border: '1px solid #A5D6A7',
              },
              filled: {
                backgroundColor: '#C8E6C9',
              },
              outlined: {
                borderColor: '#A5D6A7',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '& fieldset': {
                  borderColor: '#C8A882',
                },
                '&:hover fieldset': {
                  borderColor: '#8D6E63',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2E7D32',
                  borderWidth: '2px',
                },
              },
            },
          },
        },
        typography: {
          h1: {
            color: '#2E7D32',
            fontWeight: 700,
          },
          h2: {
            color: '#388E3C',
            fontWeight: 600,
          },
          h3: {
            color: '#4CAF50',
            fontWeight: 600,
          },
          h4: {
            color: '#6D4C41',
            fontWeight: 600,
          },
          h5: {
            color: '#8D6E63',
            fontWeight: 600,
          },
          h6: {
            color: '#A1887F',
            fontWeight: 600,
          },
          subtitle1: {
            color: '#5D4037',
          },
          subtitle2: {
            color: '#8D6E63',
          },
          body1: {
            color: '#3E2723',
          },
          body2: {
            color: '#5D4037',
          },
        },
      });
    } else if (mode === 'metallic') {
      return createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#FFD700', // Gold
            light: '#FFED4B',
            dark: '#B8860B',
          },
          secondary: {
            main: '#C0C0C0', // Silver
            light: '#E5E5E5',
            dark: '#808080',
          },
          background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#000000', // Black text for contrast
            secondary: '#333333',
            disabled: '#666666',
          },
          divider: '#CD7F32', // Bronze
          action: {
            active: '#FFD700',
            hover: '#FFF8DC',
            selected: '#F0E68C',
            disabled: '#CCCCCC',
            disabledBackground: '#F5F5F5',
          },
          error: {
            main: '#DC143C',
            light: '#FF6B6B',
            dark: '#8B0000',
          },
          warning: {
            main: '#FFA500',
            light: '#FFD700',
            dark: '#CD7F32',
          },
          success: {
            main: '#228B22',
            light: '#32CD32',
            dark: '#006400',
          },
          info: {
            main: '#4169E1',
            light: '#6495ED',
            dark: '#191970',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(192, 192, 192, 0.1), rgba(205, 127, 50, 0.1))',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(205, 127, 50, 0.2)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(192, 192, 192, 0.1), rgba(205, 127, 50, 0.1))',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(205, 127, 50, 0.2)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(255, 215, 0, 0.3)',
              },
              containedPrimary: {
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 3px 10px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500, #FFD700)',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
                },
              },
              outlinedPrimary: {
                borderColor: '#FFD700',
                color: '#000000',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#FFA500',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: 'linear-gradient(90deg, #FFD700, #C0C0C0, #CD7F32)',
                boxShadow: '0 3px 10px rgba(255, 215, 0, 0.3)',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: '#333333',
                fontWeight: 500,
              },
              selected: {
                color: '#FFD700',
                fontWeight: 600,
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                backgroundColor: '#FFD700',
                height: '3px',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: '#FFF8DC',
                color: '#000000',
                border: '1px solid #FFD700',
              },
              filled: {
                backgroundColor: '#FFD700',
                color: '#000000',
              },
              outlined: {
                borderColor: '#CD7F32',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '& fieldset': {
                  borderColor: '#CD7F32',
                },
                '&:hover fieldset': {
                  borderColor: '#C0C0C0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                  borderWidth: '2px',
                },
              },
            },
          },
        },
        typography: {
          h1: {
            color: '#000000',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
          },
          h2: {
            color: '#000000',
            fontWeight: 600,
          },
          h3: {
            color: '#000000',
            fontWeight: 600,
          },
          h4: {
            color: '#000000',
            fontWeight: 600,
          },
          h5: {
            color: '#000000',
            fontWeight: 600,
          },
          h6: {
            color: '#000000',
            fontWeight: 600,
          },
          subtitle1: {
            color: '#333333',
          },
          subtitle2: {
            color: '#333333',
          },
          body1: {
            color: '#000000',
          },
          body2: {
            color: '#333333',
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