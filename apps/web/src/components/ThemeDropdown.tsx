import React from 'react';
import { 
  Menu, 
  MenuItem, 
  Button, 
  Box, 
  Typography, 
  useTheme 
} from '@mui/material';
import { useThemeContext, ThemeMode } from '../contexts/ThemeContext';

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

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    handleClose();
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'dark': return '🌙';
      case 'pride': return '🌈';
      case 'forest': return '🌲';
      case 'metallic': return '🏆';
      default: return '☀️';
    }
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
        
        <MenuItem 
          onClick={() => handleThemeChange('pride')}
          selected={themeMode === 'pride'}
          sx={{
            backgroundColor: themeMode === 'pride' ? theme.palette.action.selected : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>🌈</Typography>
            <Typography>Pride</Typography>
          </Box>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeChange('forest')}
          selected={themeMode === 'forest'}
          sx={{
            backgroundColor: themeMode === 'forest' ? theme.palette.action.selected : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>🌲</Typography>
            <Typography>Forest</Typography>
          </Box>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeChange('metallic')}
          selected={themeMode === 'metallic'}
          sx={{
            backgroundColor: themeMode === 'metallic' ? theme.palette.action.selected : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>🏆</Typography>
            <Typography>Metallic</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemeDropdown;