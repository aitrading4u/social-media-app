import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  Tab,
  Tabs,
  Badge,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  People as PeopleIcon,
  PhotoCamera as PhotoIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import profileService, { UserProfile, Post } from '../../services/mockProfileService';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfilePost from '../../components/Profile/ProfilePost';
import MainLayout from '../../components/Layout/MainLayout';
import FloatingActionButton from '../../components/Common/FloatingActionButton';

// Helper functions for safe localStorage access
const getLocalStorageJSON = (key: string): any[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    }
    return [];
  } catch (error) {
    console.warn('localStorage not available:', error);
    return [];
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { username } = useParams<{ username: string }>();
  const { isDemoMode } = useAuthStore();

  // Load demo posts from localStorage
  useEffect(() => {
    if (isDemoMode) {
      const demoPosts = getLocalStorageJSON('demoPosts');
      if (demoPosts.length > 0) {
        // Convert demo posts to the format expected by the UI
        const formattedDemoPosts = demoPosts.map((post: any) => ({
          _id: post.id.toString(),
          author: {
            _id: 'demo-user',
            username: post.author.username,
            displayName: post.author.name,
            avatar: post.author.avatar,
            bio: 'Demo user bio',
            isVerified: true,
            followers: 0,
            following: 0,
            posts: demoPosts.length
          },
          content: post.content,
          image: post.file?.dataUrl || null,
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          isLiked: post.isLiked || false,
          createdAt: post.timestamp,
          updatedAt: new Date(post.timestamp),
          type: post.type
        }));
        setPosts(formattedDemoPosts);
      }
    }
  }, [isDemoMode]);

  // Load user posts
  const loadPosts = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingPosts(true);
      const response = await profileService.getUserPosts(user.username, 1, 10);
      setPosts(response.posts);
    } catch (err: any) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [user]);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let userData: UserProfile;
        if (username) {
          userData = await profileService.getUserProfile(username);
        } else {
          userData = await profileService.getCurrentUserProfile();
        }
        
        setUser(userData);
        
        // Load posts after user is loaded
        await loadPosts();
        
        // Load followers/following data
        try {
          const followersData = await profileService.getFollowers(userData.username, 1, 20);
          setFollowers(followersData.users);
        } catch (err) {
          console.error('Failed to load followers:', err);
        }
        
        try {
          const followingData = await profileService.getFollowing(userData.username, 1, 20);
          setFollowing(followingData.users);
        } catch (err) {
          console.error('Failed to load following:', err);
        }
        
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, loadPosts]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      if (isFollowing) {
        await profileService.unfollowUser(user.username);
        setIsFollowing(false);
        setUser(prev => prev ? { ...prev, followers: prev.followers - 1 } : null);
      } else {
        await profileService.followUser(user.username);
        setIsFollowing(true);
        setUser(prev => prev ? { ...prev, followers: prev.followers + 1 } : null);
      }
    } catch (err: any) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (post) {
        if (post.isLiked) {
          await profileService.unlikePost(postId);
          setPosts(prev => prev.map(p => 
            p._id === postId ? { ...p, isLiked: false, likes: p.likes - 1 } : p
          ));
        } else {
          await profileService.likePost(postId);
          setPosts(prev => prev.map(p => 
            p._id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p
          ));
        }
      }
    } catch (err: any) {
      console.error('Failed to like/unlike post:', err);
    }
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // TODO: Implement edit profile functionality
  };

  const handleShareProfile = () => {
    console.log('Share profile clicked');
    // TODO: Implement share profile functionality
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    // TODO: Implement settings functionality
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <CircularProgress size={60} />
        </Box>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'User not found'}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Cover Photo */}
      <Box
        sx={{
          height: 300,
          backgroundImage: user.coverPhoto ? `url(${user.coverPhoto})` : 'none',
          backgroundColor: user.coverPhoto ? 'transparent' : 'grey.300',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }}
        />
        {/* Avatar - Overlapping */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '100%' }}>
          <Box sx={{ position: 'absolute', bottom: -75, left: 32, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    border: '3px solid white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <PhotoIcon fontSize="small" />
                </IconButton>
              }
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 150,
                  height: 150,
                  border: '4px solid white',
                  boxShadow: 3
                }}
              >
                {user.displayName.charAt(0)}
              </Avatar>
            </Badge>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Modo Demo: Los posts que creas aparecerán en tu perfil. Las interacciones se simulan localmente.
          </Alert>
        )}

        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onEdit={handleEditProfile}
          onShare={handleShareProfile}
          onSettings={handleSettings}
        />

        {/* Profile Stats */}
        <ProfileStats user={user} />

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' } }}
          >
            <Tab icon={<PhotoIcon />} label="Posts" iconPosition="start" />
            <Tab icon={<BookmarkIcon />} label="Saved" iconPosition="start" />
            <Tab icon={<PeopleIcon />} label="Followers" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {loadingPosts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length > 0 ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <ProfilePost
                    post={post}
                    onLike={handleLikePost}
                    onComment={(postId) => console.log('Comment on post:', postId)}
                    onShare={(postId) => console.log('Share post:', postId)}
                    onMore={(postId) => console.log('More options for post:', postId)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <PhotoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No posts yet</Typography>
              <Typography variant="body2" color="text.secondary">
                {isDemoMode 
                  ? 'Crea tu primer post usando el botón flotante (+) en la página principal'
                  : 'When you create posts, they\'ll appear here'
                }
              </Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {savedPosts.length > 0 ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {savedPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <ProfilePost
                    post={post}
                    onLike={handleLikePost}
                    onComment={(postId) => console.log('Comment on post:', postId)}
                    onShare={(postId) => console.log('Share post:', postId)}
                    onMore={(postId) => console.log('More options for post:', postId)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <BookmarkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No saved posts yet</Typography>
              <Typography variant="body2" color="text.secondary">Posts you save will appear here</Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {loadingFollowers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : followers.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {followers.map((follower) => (
                <Grid item xs={12} sm={6} md={4} key={follower._id}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={follower.avatar}>{follower.displayName.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {follower.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{follower.username}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No followers yet</Typography>
              <Typography variant="body2" color="text.secondary">People who follow you will appear here</Typography>
            </Box>
          )}
        </TabPanel>
      </Container>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPostStory={() => console.log('Post story')}
        onPostPhoto={() => console.log('Post photo')}
        onPostVideo={() => console.log('Post video')}
        onLiveStream={() => console.log('Start livestream')}
      />
    </MainLayout>
  );
};

export default Profile; 