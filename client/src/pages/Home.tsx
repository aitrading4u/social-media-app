import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Feed from '../components/Posts/Feed';
import StoriesBar from '../components/Stories/StoriesBar';
import ContentRecommendations from '../components/AI/ContentRecommendations';
import CreatePost from '../components/Posts/CreatePost';
import { Box, Grid, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Home: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const handlePostCreated = (post: any) => {
    setShowCreatePost(false);
    // You can add logic here to refresh the feed or show a success message
    console.log('Post created:', post);
  };

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

      {/* Floating Action Button for Create Post */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 20,
          zIndex: 1300
        }}
      >
        <Fab
          size="large"
          color="primary"
          onClick={handleCreatePost}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Create Post Dialog */}
      <CreatePost
        open={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={handlePostCreated}
      />
    </MainLayout>
  );
};

export default Home; 