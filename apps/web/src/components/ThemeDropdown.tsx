import React from 'react';
import { 
  Menu, 
  MenuItem, 
  Button, 
  Box, 
  Typography, 
  useTheme 
} from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { themeMode, setThemeMode } = useThemeContext();
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newTheme: 'basic' | 'dark') => {
    setThemeMode(newTheme);
    handleClose();
  };

  const getThemeIcon = (mode: 'basic' | 'dark') => {
    return mode === 'dark' ? '🌙' : '☀️';
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <Button
        onClick={handleClick}
        variant="outlined"
        size="small"
        sx={{
          minWidth: 'auto',
          px: 2,
          py: 1,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {getThemeIcon(themeMode)} {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
          </Typography>
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            mt: 1,
            minWidth: 150,
          },
        }}
      >
        <MenuItem 
          onClick={() => handleThemeChange('basic')}
          selected={themeMode === 'basic'}
          sx={{
            backgroundColor: themeMode === 'basic' ? theme.palette.action.selected : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>☀️</Typography>
            <Typography>Basic</Typography>
          </Box>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeChange('dark')}
          selected={themeMode === 'dark'}
          sx={{
            backgroundColor: themeMode === 'dark' ? theme.palette.action.selected : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>🌙</Typography>
            <Typography>Dark</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemeDropdown;