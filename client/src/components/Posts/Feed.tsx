import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  useTheme,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Schedule as RecentIcon,
  Whatshot as PopularIcon
} from '@mui/icons-material';
import PostCard from './PostCard';

interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  hashtags?: string[];
  privacy: 'public' | 'friends' | 'private';
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SortType = 'recent' | 'trending' | 'popular';

const Feed: React.FC = () => {
  const theme = useTheme();

  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<SortType>('recent');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Mock posts data
  const mockPosts: Post[] = [
    {
      _id: '1',
      author: {
        _id: '1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD'
      },
      content: 'Just finished building an amazing new feature for our social media platform! 🚀 #coding #webdev #innovation',
      media: [{
        type: 'image',
        url: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Coding+Project',
        thumbnail: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Thumbnail'
      }],
      hashtags: ['coding', 'webdev', 'innovation'],
      privacy: 'public',
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      _id: '2',
      author: {
        _id: '2',
        username: 'janesmith',
        displayName: 'Jane Smith',
        avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS'
      },
      content: 'New design project completed! Love how this turned out ✨ #design #creativity #art',
      media: [{
        type: 'image',
        url: 'https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Design+Project',
        thumbnail: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Thumbnail'
      }],
      hashtags: ['design', 'creativity', 'art'],
      privacy: 'public',
      likes: 89,
      comments: 15,
      shares: 8,
      isLiked: true,
      isBookmarked: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      _id: '3',
      author: {
        _id: '3',
        username: 'mikejohnson',
        displayName: 'Mike Johnson',
        avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ'
      },
      content: 'Amazing sunset in Valencia today! 📸 #photography #sunset #valencia #spain',
      media: [{
        type: 'image',
        url: 'https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Sunset+Photo',
        thumbnail: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Thumbnail'
      }],
      hashtags: ['photography', 'sunset', 'valencia', 'spain'],
      privacy: 'public',
      likes: 234,
      comments: 34,
      shares: 45,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '4',
      author: {
        _id: '4',
        username: 'sarahwilson',
        displayName: 'Sarah Wilson',
        avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=SW'
      },
      content: 'Check out this amazing new track I just released! 🎵 #music #newrelease #electronic',
      media: [{
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Music+Video'
      }],
      hashtags: ['music', 'newrelease', 'electronic'],
      privacy: 'public',
      likes: 567,
      comments: 89,
      shares: 123,
      isLiked: true,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  const loadPosts = useCallback(async (pageNum: number, sort: SortType) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate pagination
      const startIndex = (pageNum - 1) * 5;
      const endIndex = startIndex + 5;
      const newPosts = mockPosts.slice(startIndex, endIndex);
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 5);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
      showSnackbar('Error loading posts', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(1, sortType);
  }, [sortType, loadPosts]);

  const handleSortChange = (event: React.SyntheticEvent, newValue: SortType) => {
    setSortType(newValue);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1, sortType);
    }
  };



  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = async (postId: string, comment: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));
    
    showSnackbar('Comment posted!', 'success');
  };

  const handleShare = (postId: string) => {
    // Simulate share functionality
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    showSnackbar('Post link copied to clipboard!', 'success');
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    
    const post = posts.find(p => p._id === postId);
    if (post) {
      showSnackbar(
        post.isBookmarked ? 'Post removed from bookmarks' : 'Post saved to bookmarks',
        'success'
      );
    }
  };

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    showSnackbar('Post deleted successfully', 'success');
  };

  const handleEdit = (postId: string) => {
    // TODO: Implement edit functionality
    showSnackbar('Edit functionality coming soon!', 'info');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const sortOptions = [
    { value: 'recent', label: 'Recent', icon: <RecentIcon /> },
    { value: 'trending', label: 'Trending', icon: <TrendingIcon /> },
    { value: 'popular', label: 'Popular', icon: <PopularIcon /> }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Sort Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={sortType} 
          onChange={handleSortChange}
          variant="fullWidth"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: '0.875rem'
            }
          }}
        >
          {sortOptions.map((option) => (
            <Tab
              key={option.value}
              value={option.value}
              label={option.label}
              icon={option.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Posts Feed */}
      <Box sx={{ mb: 2 }}>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Box>

      {/* Load More */}
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}

      {/* No More Posts */}
      {!hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            You've reached the end of your feed
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share something amazing!
          </Typography>
        </Box>
      )}





      {/* Snackbar */}
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
    </Container>
  );
};

export default Feed; 