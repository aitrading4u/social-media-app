import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Psychology as AIIcon,
  PersonAdd as FollowIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Lightbulb as InsightIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface RecommendedPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  category: string;
  tags: string[];
  engagement: number;
  relevance: number;
  reason: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface RecommendedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  mutualConnections: number;
  interests: string[];
  relevance: number;
  reason: string;
  isFollowing: boolean;
}

interface UserInsight {
  type: 'engagement' | 'interests' | 'activity' | 'growth';
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface ContentRecommendationsProps {
  onPostClick?: (post: RecommendedPost) => void;
  onUserClick?: (user: RecommendedUser) => void;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({
  onPostClick,
  onUserClick
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [recommendedPosts, setRecommendedPosts] = useState<RecommendedPost[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
  const [userInsights, setUserInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'insights'>('posts');

  // Mock AI recommendations
  const mockRecommendedPosts: RecommendedPost[] = [
    {
      id: '1',
      title: 'Advanced React Patterns for 2024',
      content: 'Discover the latest React patterns and best practices that will make your code more maintainable and performant...',
      author: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=SC',
        username: 'sarahchen'
      },
      category: 'Technology',
      tags: ['react', 'javascript', 'webdev'],
      engagement: 95,
      relevance: 98,
      reason: 'Based on your interest in React and JavaScript',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Design Systems: From Theory to Practice',
      content: 'Learn how to build scalable design systems that improve consistency and developer experience...',
      author: {
        id: '2',
        name: 'Alex Rodriguez',
        avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=AR',
        username: 'alexrodriguez'
      },
      category: 'Design',
      tags: ['design', 'ui', 'ux'],
      engagement: 87,
      relevance: 92,
      reason: 'Matches your design interests',
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'The Future of Social Media Platforms',
      content: 'Exploring emerging trends in social media and how AI is reshaping user experiences...',
      author: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://via.placeholder.com/150/6c5ce7/ffffff?text=EW',
        username: 'emmawilson'
      },
      category: 'Technology',
      tags: ['social-media', 'ai', 'trends'],
      engagement: 78,
      relevance: 85,
      reason: 'Similar to content you engage with',
      isLiked: false,
      isBookmarked: true
    }
  ];

  const mockRecommendedUsers: RecommendedUser[] = [
    {
      id: '1',
      name: 'David Kim',
      username: 'davidkim',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=DK',
      bio: 'Full-stack developer passionate about React, Node.js, and building scalable applications',
      followers: 1247,
      mutualConnections: 8,
      interests: ['react', 'nodejs', 'typescript'],
      relevance: 96,
      reason: '8 mutual connections, similar tech interests',
      isFollowing: false
    },
    {
      id: '2',
      name: 'Lisa Park',
      username: 'lisapark',
      avatar: 'https://via.placeholder.com/150/00b894/ffffff?text=LP',
      bio: 'UI/UX Designer creating beautiful and functional user experiences',
      followers: 892,
      mutualConnections: 5,
      interests: ['design', 'ui', 'ux'],
      relevance: 88,
      reason: '5 mutual connections, design-focused content',
      isFollowing: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: 'mikejohnson',
      avatar: 'https://via.placeholder.com/150/e17055/ffffff?text=MJ',
      bio: 'Tech blogger and software engineer sharing insights about modern development',
      followers: 2341,
      mutualConnections: 12,
      interests: ['javascript', 'webdev', 'programming'],
      relevance: 94,
      reason: '12 mutual connections, tech content creator',
      isFollowing: false
    }
  ];

  const mockUserInsights: UserInsight[] = [
    {
      type: 'engagement',
      title: 'Engagement Rate',
      description: 'Your posts are getting 23% more engagement than last month',
      value: '+23%',
      trend: 'up',
      icon: <TrendingIcon />
    },
    {
      type: 'interests',
      title: 'Top Interests',
      description: 'You engage most with React, Design, and AI content',
      value: 'React, Design, AI',
      trend: 'stable',
      icon: <AIIcon />
    },
    {
      type: 'activity',
      title: 'Active Hours',
      description: 'You\'re most active between 2-4 PM and 8-10 PM',
      value: '2-4 PM, 8-10 PM',
      trend: 'stable',
      icon: <InsightIcon />
    },
    {
      type: 'growth',
      title: 'Follower Growth',
      description: 'Gained 45 new followers this week',
      value: '+45',
      trend: 'up',
      icon: <TrendingIcon />
    }
  ];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendedPosts(mockRecommendedPosts);
      setRecommendedUsers(mockRecommendedUsers);
      setUserInsights(mockUserInsights);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostLike = (postId: string) => {
    setRecommendedPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isLiked: !post.isLiked } : post
    ));
  };

  const handlePostBookmark = (postId: string) => {
    setRecommendedPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
    ));
  };

  const handleUserFollow = (userId: string) => {
    setRecommendedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return theme.palette.success.main;
      case 'down': return theme.palette.error.main;
      case 'stable': return theme.palette.info.main;
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return theme.palette.success.main;
    if (relevance >= 80) return theme.palette.warning.main;
    return theme.palette.info.main;
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
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            AI Recommendations
          </Typography>
        </Box>
        <Tooltip title="Refresh recommendations">
          <IconButton onClick={loadRecommendations} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant={activeTab === 'posts' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveTab('posts')}
        >
          Recommended Posts ({recommendedPosts.length})
        </Button>
        <Button
          variant={activeTab === 'users' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveTab('users')}
        >
          People to Follow ({recommendedUsers.length})
        </Button>
        <Button
          variant={activeTab === 'insights' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setActiveTab('insights')}
        >
          Your Insights
        </Button>
      </Box>

      {/* Recommended Posts */}
      {activeTab === 'posts' && (
        <Box>
          {recommendedPosts.map((post) => (
            <Card key={post.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => onPostClick?.(post)}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar src={post.author.avatar} sx={{ width: 48, height: 48 }}>
                    {post.author.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {post.author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{post.author.username}
                      </Typography>
                      <Chip
                        label={`${post.relevance}% match`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getRelevanceColor(post.relevance), 0.1),
                          color: getRelevanceColor(post.relevance),
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {post.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 {post.reason}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostLike(post.id);
                      }}
                    >
                      {post.isLiked ? <LikeIcon color="error" /> : <LikeOutlineIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostBookmark(post.id);
                      }}
                    >
                      <BookmarkIcon color={post.isBookmarked ? 'primary' : 'action'} />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Recommended Users */}
      {activeTab === 'users' && (
        <List>
          {recommendedUsers.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} sx={{ width: 56, height: 56 }}>
                  {user.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                    <Chip
                      label={`${user.relevance}% match`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getRelevanceColor(user.relevance), 0.1),
                        color: getRelevanceColor(user.relevance),
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {user.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {user.followers.toLocaleString()} followers
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.mutualConnections} mutual connections
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      {user.interests.map((interest) => (
                        <Chip key={interest} label={interest} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 {user.reason}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  variant={user.isFollowing ? "outlined" : "contained"}
                  size="small"
                  startIcon={<FollowIcon />}
                  onClick={() => handleUserFollow(user.id)}
                  sx={{ minWidth: 100 }}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* User Insights */}
      {activeTab === 'insights' && (
        <Box>
          {userInsights.map((insight, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      color: getTrendColor(insight.trend),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: alpha(getTrendColor(insight.trend), 0.1)
                    }}
                  >
                    {insight.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {insight.description}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: getTrendColor(insight.trend)
                      }}
                    >
                      {insight.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ContentRecommendations; 