import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AuthComponent from '../components/AuthComponent';
import CalendarContainer from '../components/layout/CalendarContainer';
import ChatContainer from '../components/layout/ChatContainer';

const MainAppPage: React.FC = () => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <AuthComponent />;
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Tenex Calendar & Chat
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          color="text.secondary"
          sx={{ 
            textAlign: { xs: 'center', sm: 'left' },
            mb: 3
          }}
        >
          Manage your schedule and conversations in one place
        </Typography>
      </Box>
      
      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }}
        sx={{ 
          flex: 1,
          minHeight: { xs: 'auto', md: '600px' },
          maxHeight: '600px',
          alignItems: 'stretch'
        }}
      >
        <Grid item xs={12} lg={8} xl={7} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CalendarContainer />
        </Grid>
        <Grid item xs={12} lg={4} xl={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <ChatContainer />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainAppPage;