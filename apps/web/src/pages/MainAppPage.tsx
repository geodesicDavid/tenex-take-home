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
        py: { xs: 2, sm: 3, md: 4 }
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
          height: { xs: 'auto', md: 'calc(100vh - 200px)' },
          maxHeight: { xs: 'none', md: '800px' },
          alignItems: 'stretch'
        }}
      >
        <Grid item xs={12} lg={8} xl={7}>
          <CalendarContainer />
        </Grid>
        <Grid item xs={12} lg={4} xl={5}>
          <ChatContainer />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainAppPage;