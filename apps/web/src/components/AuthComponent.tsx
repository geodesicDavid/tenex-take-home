import React from 'react';
import { Button, Container, Box, Typography, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AuthComponent: React.FC = () => {
  const { authState, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authState.isLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenex Take Home
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {authState.isAuthenticated
            ? `Welcome, ${authState.user?.name}!`
            : 'Welcome to the Tenex take home project. Please login to continue.'}
        </Typography>
        
        {authState.isAuthenticated ? (
          <Box>
            {authState.user?.picture && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={authState.user.picture}
                  alt={authState.user.name}
                  style={{ width: 80, height: 80, borderRadius: '50%' }}
                />
              </Box>
            )}
            <Typography variant="body2" sx={{ mb: 2 }}>
              Logged in as: {authState.user?.email}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              startIcon={<GoogleIcon />}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            startIcon={<GoogleIcon />}
            size="large"
          >
            Login with Google
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default AuthComponent;