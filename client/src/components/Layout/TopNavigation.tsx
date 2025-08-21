import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,

  LiveTv as LiveIcon,
  Analytics as AnalyticsIcon,
  Psychology as AIIcon,
  ShoppingCart as MarketplaceIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  GetApp as GetAppIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Add as AddIcon
} from '@mui/icons-material';
import SearchDropdown from '../Common/SearchDropdown';
import { searchContent, SearchResult } from '../../services/searchService';
import { UserProfile, Post } from '../../services/mockProfileService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import InstallGuide from '../PWA/InstallGuide';
import CreatePost from '../Posts/CreatePost';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const TopNavigation: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
    handleClose();
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const handlePostCreated = (post: any) => {
    setShowCreatePost(false);
    console.log('Post created:', post);
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearchLoading(true);
      try {
        const results = await searchContent(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery('');

    if (result.type === 'user') {
      const user = result.data as UserProfile;
      navigate(`/profile/${user.username}`);
    } else if (result.type === 'post') {
      const post = result.data as Post;
      navigate(`/post/${post._id}`);
    } else if (result.type === 'hashtag') {
      const hashtag = result.data as { name: string; count: number };
      navigate(`/search?q=${encodeURIComponent(hashtag.name)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1200,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          onClick={() => navigate('/')}
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            },
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          TIPPER
        </Typography>

        {/* Search Bar and Navigation Icons - Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <Box sx={{ position: 'relative', maxWidth: 300 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar usuarios, posts..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
            </Search>
            <SearchDropdown
              query={searchQuery}
              results={searchResults}
              isLoading={isSearchLoading}
              isOpen={isSearchOpen}
              onResultClick={handleSearchResultClick}
              onQueryChange={setSearchQuery}
              onClose={handleSearchClose}
            />
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/live')}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <LiveIcon />
            </IconButton>

            <IconButton 
              color="inherit"
              onClick={() => navigate('/analytics')}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <AnalyticsIcon />
            </IconButton>

            <IconButton 
              color="inherit"
              onClick={() => navigate('/ai-recommendations')}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <AIIcon />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => navigate('/marketplace')}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <MarketplaceIcon />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => setShowInstallGuide(true)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <GetAppIcon />
            </IconButton>

            {/* User Menu */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            zIndex: 1300,
            '& .MuiPaper-root': {
              borderRadius: 2,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={() => { handleClose(); navigate('/profile/demo_user'); }}>
            <PersonIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            Perfil
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/notifications'); }}>
            <NotificationsIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
            Notificaciones
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/messages'); }}>
            <MessageIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
            Mensajes
          </MenuItem>
          <MenuItem onClick={handleCreatePost}>
            <AddIcon sx={{ mr: 2, color: theme.palette.success.main }} />
            Crear Post
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
            <SettingsIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
            Configuración
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
            <LogoutIcon sx={{ mr: 2, color: theme.palette.error.main }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Install Guide Dialog */}
      <InstallGuide
        open={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />

      {/* Create Post Dialog */}
      <CreatePost
        open={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={handlePostCreated}
      />
    </AppBar>
  );
};

export default TopNavigation; 