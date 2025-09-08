import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AuthComponent from '../components/AuthComponent';

const MainAppPage: React.FC = () => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <AuthComponent />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenex Take Home - Main Application
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the main application! This is a placeholder for the calendar and chat interface.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Calendar Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calendar integration will be implemented here.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Chat Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chat interface will be implemented here.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MainAppPage;