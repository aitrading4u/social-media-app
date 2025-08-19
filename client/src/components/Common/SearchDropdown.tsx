import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Tag as TagIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { SearchResult, getTrendingSearches, getRecentSearches, saveRecentSearch } from '../../services/searchService';
import { UserProfile, Post } from '../../services/mockProfileService';

interface SearchDropdownProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  isOpen: boolean;
  onResultClick: (result: SearchResult) => void;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  results,
  isLoading,
  isOpen,
  onResultClick,
  onQueryChange,
  onClose
}) => {
  const theme = useTheme();
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !query) {
      loadSuggestions();
    }
  }, [isOpen, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const loadSuggestions = async () => {
    const [trending, recent] = await Promise.all([
      getTrendingSearches(),
      Promise.resolve(getRecentSearches())
    ]);
    setTrendingSearches(trending);
    setRecentSearches(recent);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    saveRecentSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    if (result.type === 'user') {
      saveRecentSearch((result.data as UserProfile).username);
    } else if (result.type === 'hashtag') {
      saveRecentSearch((result.data as { name: string }).name);
    }
  };

  const renderUserResult = (user: UserProfile) => (
    <ListItem
      button
      onClick={() => handleResultClick({ type: 'user', data: user, relevance: 0 })}
      sx={{
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08)
        }
      }}
    >
      <ListItemAvatar>
        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
          {user.displayName.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
            <Typography variant="caption" color="text.secondary">
              {user.followers.toLocaleString()} followers
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );

  const renderPostResult = (post: Post) => (
    <ListItem
      button
      onClick={() => handleResultClick({ type: 'post', data: post, relevance: 0 })}
      sx={{
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08)
        }
      }}
    >
      <ListItemAvatar>
        <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }}>
          {post.author.displayName.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {post.author.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{post.author.username}
            </Typography>
          </Box>
        }
        secondary={
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {post.content}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
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
          </Box>
        }
      />
    </ListItem>
  );

  const renderHashtagResult = (hashtag: { name: string; count: number }) => (
    <ListItem
      button
      onClick={() => handleResultClick({ type: 'hashtag', data: hashtag, relevance: 0 })}
      sx={{
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08)
        }
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ width: 40, height: 40, backgroundColor: theme.palette.secondary.main }}>
          <TagIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {hashtag.name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {hashtag.count.toLocaleString()} posts
          </Typography>
        }
      />
    </ListItem>
  );

  const renderSuggestions = () => (
    <Box>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pb: 1 }}>
            <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Recent Searches
            </Typography>
          </Box>
          <List dense>
            {recentSearches.slice(0, 5).map((search, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(search)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: 'grey.300' }}>
                    <SearchIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {search}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      )}

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pb: 1 }}>
            <TrendingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Trending
            </Typography>
          </Box>
          <List dense>
            {trendingSearches.slice(0, 5).map((search, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(search)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.primary.main }}>
                    <TrendingIcon sx={{ fontSize: 16, color: 'white' }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {search}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );

  if (!isOpen) return null;

  return (
    <Paper
      ref={dropdownRef}
      elevation={8}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1300,
        maxHeight: 400,
        overflow: 'auto',
        borderRadius: 2,
        mt: 1
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : query ? (
        <List>
          {results.length > 0 ? (
            results.map((result, index) => (
              <React.Fragment key={`${result.type}-${index}`}>
                {result.type === 'user' && renderUserResult(result.data as UserProfile)}
                {result.type === 'post' && renderPostResult(result.data as Post)}
                {result.type === 'hashtag' && renderHashtagResult(result.data as { name: string; count: number })}
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results found for "{query}"
              </Typography>
            </Box>
          )}
        </List>
      ) : (
        renderSuggestions()
      )}
    </Paper>
  );
};

export default SearchDropdown; 