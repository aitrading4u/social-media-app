import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { UserProfile } from '../../services/mockProfileService';

interface ProfileStatsProps {
  user: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        backgroundColor: 'white', 
        borderRadius: 2, 
        mb: 2, 
        boxShadow: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 6 
      }}
    >
      <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            '&:hover': { color: 'primary.dark' }
          }}
        >
          {formatNumber(user.posts)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Posts
        </Typography>
      </Box>
      
      <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            '&:hover': { color: 'primary.dark' }
          }}
        >
          {formatNumber(user.followers)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Followers
        </Typography>
      </Box>
      
      <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            '&:hover': { color: 'primary.dark' }
          }}
        >
          {formatNumber(user.following)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Following
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProfileStats; 