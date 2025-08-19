import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { searchContent, SearchResult, SearchFilters } from '../../services/searchService';
import { UserProfile, Post } from '../../services/mockProfileService';
import MainLayout from '../../components/Layout/MainLayout';

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
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance'
  });
  const theme = useTheme();

  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchContent(query, filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters, performSearch]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const tabTypes: ('all' | 'user' | 'post' | 'hashtag')[] = ['all', 'user', 'post', 'hashtag'];
    setFilters(prev => ({ ...prev, type: tabTypes[newValue] }));
  };

  const handleSortChange = (event: any) => {
    setFilters(prev => ({ ...prev, sortBy: event.target.value }));
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return result.type === 'user';
    if (activeTab === 2) return result.type === 'post';
    if (activeTab === 3) return result.type === 'hashtag';
    return true;
  });

  const renderUserCard = (user: UserProfile) => (
    <Card key={user._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={user.coverPhoto || 'https://via.placeholder.com/400x140/667eea/ffffff?text=Cover'}
        alt="Cover photo"
      />
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Avatar
          src={user.avatar}
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            border: 3,
            borderColor: 'white',
            boxShadow: 2
          }}
        >
          {user.displayName.charAt(0)}
        </Avatar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" component="h2">
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
                height: 20,
                minWidth: 20
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {user.followers.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Followers
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {user.following.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Following
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {user.posts}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
          </Box>
        </Box>
        <Button
          variant={user.isFollowing ? "outlined" : "contained"}
          fullWidth
          size="small"
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderPostCard = (post: Post) => (
    <Card key={post._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {post.media && (
        <CardMedia
          component="img"
          height="200"
          image={post.media.url}
          alt="Post media"
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={post.author.avatar} sx={{ mr: 2 }}>
            {post.author.displayName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {post.author.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{post.author.username}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              ❤️ {post.likes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              💬 {post.comments}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🔄 {post.shares}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderHashtagCard = (hashtag: { name: string; count: number }) => (
    <Card key={hashtag.name} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            backgroundColor: theme.palette.secondary.main
          }}
        >
          <TagIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h6" component="h2" gutterBottom>
          {hashtag.name}
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          {hashtag.count.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          posts
        </Typography>
        <Button variant="contained" fullWidth size="small">
          Explore
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for users, posts, hashtags..."
            value={query}
            onChange={handleQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Filters and Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="search tabs">
              <Tab label="All" />
              <Tab label="Users" />
              <Tab label="Posts" />
              <Tab label="Hashtags" />
            </Tabs>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort by"
                onChange={handleSortChange}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Results */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : query ? (
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {filteredResults.map((result) => {
                const key = result.type === 'user' || result.type === 'post' 
                  ? `${result.type}-${(result.data as UserProfile | Post)._id}`
                  : `${result.type}-${(result.data as { name: string; count: number }).name}`;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    {result.type === 'user' && renderUserCard(result.data as UserProfile)}
                    {result.type === 'post' && renderPostCard(result.data as Post)}
                    {result.type === 'hashtag' && renderHashtagCard(result.data as { name: string; count: number })}
                  </Grid>
                );
              })}
            </Grid>
            {filteredResults.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No results found for "{query}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or filters
                </Typography>
              </Box>
            )}
          </TabPanel>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Start searching
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter a search term to find users, posts, and hashtags
            </Typography>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default Search; 