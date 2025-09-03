import { Box, Typography, Container } from "@mui/material";

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenex Take Home
        </Typography>
        <Typography variant="body1">
          Welcome to the Tenex take home project. This is the main application.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
