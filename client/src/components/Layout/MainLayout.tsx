import React, { useState } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Fab,
  Avatar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  AccountCircle as ProfileIcon,
  MonetizationOn as TokenIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import TokenBalance from '../Tokens/TokenBalance';
import PurchaseTokens from '../Tokens/PurchaseTokens';
import TopNavigation from './TopNavigation';
import Breadcrumbs from '../Common/Breadcrumbs';
import CreatePost from '../Posts/CreatePost';
import MessagesDrawer from './MessagesDrawer';
import NotificationsDrawer from './NotificationsDrawer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  // Debug logging
  console.log('MainLayout v2.0 - isMobile:', isMobile);
  console.log('MainLayout v2.0 - current path:', location.pathname);
  console.log('MainLayout v2.0 - window width:', window.innerWidth);
  console.log('MainLayout v2.0 - theme breakpoints:', theme.breakpoints.down('md'));

  // State for token balance panel
  const [showTokenBalance, setShowTokenBalance] = useState(false);
  const [showPurchaseTokens, setShowPurchaseTokens] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // State for drawer panels
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  const navigationItems = [
    { icon: <HomeIcon />, label: 'Inicio', path: '/' },
    { icon: <SearchIcon />, label: 'Buscar', path: '/search' },
    { icon: <ProfileIcon />, label: 'Perfil', path: `/profile/${user?.username || 'demo_user'}` }
  ];

  const handleTokenBalanceClick = () => {
    setShowTokenBalance(true);
  };

  const handleCloseTokenBalance = () => {
    setShowTokenBalance(false);
  };

  const handlePurchaseTokens = () => {
    setShowPurchaseTokens(true);
    setShowTokenBalance(false);
  };

  const handleClosePurchaseTokens = () => {
    setShowPurchaseTokens(false);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const handlePostCreated = (post: any) => {
    setShowCreatePost(false);
    console.log('Post created:', post);
  };

  const handleMessagesClick = () => {
    setShowMessagesDrawer(true);
  };

  const handleNotificationsClick = () => {
    setShowNotificationsDrawer(true);
  };

  const handlePurchase = async (amount: number, currency: string, paymentMethod: string) => {
    // Demo mode - simulate purchase
    console.log('Purchase tokens:', { amount, currency, paymentMethod });

    // In a real app, this would make an API call to process the payment
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    // Show success message (you could add a snackbar here)
    alert(`¡Compra exitosa! Has comprado ${amount} tokens por ${currency} usando ${paymentMethod}`);
  };

  // Mock data for messages
  const messages = [
    { id: 1, sender: 'John Doe', message: 'Hey! How are you doing?', time: '2m ago', avatar: 'J' },
    { id: 2, sender: 'Jane Smith', message: 'Did you see the new post?', time: '5m ago', avatar: 'J' },
    { id: 3, sender: 'Mike Johnson', message: 'Great work on the project!', time: '1h ago', avatar: 'M' },
    { id: 4, sender: 'Sarah Chen', message: 'Can we meet tomorrow?', time: '2h ago', avatar: 'S' },
    { id: 5, sender: 'Alex Rodriguez', message: 'Thanks for the help!', time: '3h ago', avatar: 'A' }
  ];

  // Mock data for notifications
  const notifications = [
    { id: 1, type: 'like', user: 'John Doe', action: 'liked your post', time: '1m ago', avatar: 'J' },
    { id: 2, type: 'comment', user: 'Jane Smith', action: 'commented on your post', time: '3m ago', avatar: 'J' },
    { id: 3, type: 'follow', user: 'Mike Johnson', action: 'started following you', time: '10m ago', avatar: 'M' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Top Navigation with Search Bar */}
      <TopNavigation />

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'divider',
            zIndex: 1100,
            padding: '8px 0'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            {navigationItems.map((item) => (
              <IconButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  flexDirection: 'column',
                  gap: 0.5,
                  minWidth: 'auto',
                  padding: '8px 4px'
                }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {item.label}
                </Typography>
              </IconButton>
            ))}
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box 
        sx={{
          paddingTop: '64px', // Height of AppBar
          paddingBottom: isMobile ? '80px' : '20px', // Space for bottom nav on mobile
          minHeight: '100vh'
        }}
      >
        {/* Breadcrumbs - only show on pages other than home */}
        {location.pathname !== '/' && (
          <Box sx={{ px: 2, pt: 2 }}>
            <Breadcrumbs />
          </Box>
        )}
        {children}
      </Box>

      {/* Right Side Buttons - Mobile Only */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {/* Messages Button */}
          <Fab
            size="medium"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
            onClick={handleMessagesClick}
          >
            <Badge badgeContent={5} color="error">
              <MessageIcon />
            </Badge>
          </Fab>

          {/* Notifications Button */}
          <Fab
            size="medium"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
            onClick={handleNotificationsClick}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </Fab>

          {/* Create Post Button */}
          <Fab
            size="large"
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
            onClick={handleCreatePost}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {/* Desktop Right Side Buttons */}
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1300
          }}
        >
          <Fab
            size="large"
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
            onClick={handleCreatePost}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {/* Token Balance Panel */}
      {showTokenBalance && (
        <Box
          sx={{
            position: 'fixed',
            bottom: isMobile ? 180 : 100,
            right: 20,
            width: isMobile ? 'calc(100vw - 40px)' : 400,
            maxHeight: '60vh',
            zIndex: 1400,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'primary.main',
              color: 'white'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Token Balance
            </Typography>
            <IconButton
              onClick={handleCloseTokenBalance}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ maxHeight: 'calc(60vh - 60px)', overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <TokenBalance
                balance={1000}
                earned={2500}
                spent={1500}
                referralEarnings={300}
                onPurchase={handlePurchaseTokens}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Purchase Tokens Dialog */}
      <PurchaseTokens
        open={showPurchaseTokens}
        onClose={handleClosePurchaseTokens}
        onPurchase={handlePurchase}
      />

      {/* Create Post Dialog */}
      <CreatePost
        open={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={handlePostCreated}
      />

      {/* Messages Drawer */}
      <MessagesDrawer 
        open={showMessagesDrawer}
        onClose={() => setShowMessagesDrawer(false)}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer 
        open={showNotificationsDrawer}
        onClose={() => setShowNotificationsDrawer(false)}
      />
    </Box>
  );
};

export default MainLayout; 