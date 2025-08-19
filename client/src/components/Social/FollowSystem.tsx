import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified: boolean;
  isFollowing: boolean;
}

interface FollowSystemProps {
  type: 'followers' | 'following' | 'suggestions';
  userId?: string;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
}

const FollowSystem: React.FC<FollowSystemProps> = ({ 
  type, 
  userId, 
  onFollowChange 
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<{ [key: string]: boolean }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Mock data for different types
  const mockFollowers: User[] = [
    {
      _id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
      bio: '🚀 Full-stack developer passionate about creating amazing experiences.',
      followers: 1247,
      following: 89,
      isVerified: true,
      isFollowing: true
    },
    {
      _id: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS',
      bio: '🎨 Creative designer and digital artist.',
      followers: 892,
      following: 234,
      isVerified: false,
      isFollowing: true
    },
    {
      _id: '3',
      username: 'mikejohnson',
      displayName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ',
      bio: '📸 Photography enthusiast and travel blogger.',
      followers: 567,
      following: 123,
      isVerified: false,
      isFollowing: false
    }
  ];

  const mockFollowing: User[] = [
    {
      _id: '4',
      username: 'sarahwilson',
      displayName: 'Sarah Wilson',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=SW',
      bio: '🎵 Music producer and DJ.',
      followers: 2341,
      following: 456,
      isVerified: true,
      isFollowing: true
    },
    {
      _id: '5',
      username: 'alexgarcia',
      displayName: 'Alex García',
      avatar: 'https://via.placeholder.com/150/45b7d1/ffffff?text=AG',
      bio: '🏃‍♂️ Fitness coach and nutrition expert.',
      followers: 1890,
      following: 234,
      isVerified: false,
      isFollowing: true
    }
  ];

  const mockSuggestions: User[] = [
    {
      _id: '6',
      username: 'emilybrown',
      displayName: 'Emily Brown',
      avatar: 'https://via.placeholder.com/150/6c5ce7/ffffff?text=EB',
      bio: '🎭 Actress and content creator.',
      followers: 3456,
      following: 789,
      isVerified: true,
      isFollowing: false
    },
    {
      _id: '7',
      username: 'davidlee',
      displayName: 'David Lee',
      avatar: 'https://via.placeholder.com/150/e17055/ffffff?text=DL',
      bio: '💻 Software engineer and tech blogger.',
      followers: 1234,
      following: 567,
      isVerified: false,
      isFollowing: false
    },
    {
      _id: '8',
      username: 'lisawang',
      displayName: 'Lisa Wang',
      avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=LW',
      bio: '🎨 Illustrator and comic artist.',
      followers: 2789,
      following: 432,
      isVerified: true,
      isFollowing: false
    }
  ];

  useEffect(() => {
    loadUsers();
  }, [type, userId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let userData: User[] = [];
      switch (type) {
        case 'followers':
          userData = mockFollowers;
          break;
        case 'following':
          userData = mockFollowing;
          break;
        case 'suggestions':
          userData = mockSuggestions;
          break;
      }
      
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      showSnackbar('Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUser: User) => {
    if (followLoading[targetUser._id]) return;

    setFollowLoading(prev => ({ ...prev, [targetUser._id]: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newIsFollowing = !targetUser.isFollowing;
      
      setUsers(prev => prev.map(user => {
        if (user._id === targetUser._id) {
          return {
            ...user,
            isFollowing: newIsFollowing,
            followers: newIsFollowing ? user.followers + 1 : user.followers - 1
          };
        }
        return user;
      }));

      onFollowChange?.(targetUser._id, newIsFollowing);
      
      showSnackbar(
        newIsFollowing 
          ? `You are now following ${targetUser.displayName}` 
          : `You unfollowed ${targetUser.displayName}`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      showSnackbar('Error updating follow status', 'error');
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUser._id]: false }));
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getTitle = () => {
    switch (type) {
      case 'followers':
        return 'Followers';
      case 'following':
        return 'Following';
      case 'suggestions':
        return 'Suggested for you';
      default:
        return 'Users';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {getTitle()} ({users.length})
      </Typography>

      {users.length === 0 ? (
        <Alert severity="info">
          {type === 'followers' && 'No followers yet'}
          {type === 'following' && 'Not following anyone yet'}
          {type === 'suggestions' && 'No suggestions available'}
        </Alert>
      ) : (
        <List>
          {users.map((user) => (
            <ListItem
              key={user._id}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  src={user.avatar}
                  sx={{ width: 56, height: 56 }}
                >
                  {user.displayName.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.displayName}
                    </Typography>
                    {user.isVerified && (
                      <Chip
                        label="✓"
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 16,
                          minWidth: 16
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                    {user.bio && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {user.bio}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {user.followers.toLocaleString()} followers
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.following.toLocaleString()} following
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              
                                                           <ListItemSecondaryAction>
                  {user._id !== user?._id && (
                   <Button
                    variant={user.isFollowing ? "outlined" : "contained"}
                    size="small"
                    startIcon={
                      followLoading[user._id] ? (
                        <CircularProgress size={16} />
                      ) : user.isFollowing ? (
                        <CheckIcon />
                      ) : (
                        <FollowIcon />
                      )
                    }
                    onClick={() => handleFollowToggle(user)}
                    disabled={followLoading[user._id]}
                    sx={{
                      minWidth: 100,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FollowSystem; 