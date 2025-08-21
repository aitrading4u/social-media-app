import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Feed from '../components/Posts/Feed';
import StoriesBar from '../components/Stories/StoriesBar';
import ContentRecommendations from '../components/AI/ContentRecommendations';
import { Box, Grid } from '@mui/material';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <StoriesBar />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Feed />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ContentRecommendations />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Home; 