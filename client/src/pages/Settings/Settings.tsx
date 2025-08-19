import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import MainLayout from '../../components/Layout/MainLayout';

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Account settings - coming soon
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Settings; 