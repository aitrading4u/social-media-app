import React, { useState } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Badge,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance as TokenIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import TokenBalance from '../Tokens/TokenBalance';

const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const tokenData = {
    balance: 1250,
    earned: 340,
    spent: 890,
    referralEarnings: 120
  };

  const handlePurchaseTokens = () => {
    console.log('Opening token purchase dialog');
    // TODO: Implement token purchase
  };

  return (
    <>
      {/* Floating Menu Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20, // Positioned at the bottom
          right: 20,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.1)'
            }
          }}
        >
          <TokenIcon />
        </IconButton>
      </Box>

      {/* Side Menu Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 400,
            height: '100vh',
            zIndex: '99999999 !important', // Extremely high z-index
            position: 'fixed !important',
            top: '0 !important',
            right: '0 !important',
            backgroundColor: 'white',
            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
            transform: 'none !important',
            left: 'auto !important', // Ensure it doesn't interfere with left positioning
            bottom: 'auto !important' // Ensure it doesn't interfere with bottom positioning
          },
          '& .MuiBackdrop-root': {
            zIndex: '99999998 !important'
          }
        }}
        ModalProps={{
          keepMounted: true,
          disablePortal: false,
          hideBackdrop: false
        }}
        variant="temporary"
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'primary.main',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TokenIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                TIPPER Menu
              </Typography>
            </Box>
            <IconButton
              onClick={toggleDrawer}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Token Balance Section */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TokenBalance
              balance={tokenData.balance}
              earned={tokenData.earned}
              spent={tokenData.spent}
              referralEarnings={tokenData.referralEarnings}
              onPurchase={handlePurchaseTokens}
            />
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List sx={{ p: 0 }}>
              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <Badge badgeContent={5} color="error">
                    <ChatIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary="Messages" 
                  secondary="5 unread messages"
                />
              </ListItem>

              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary="Notifications" 
                  secondary="3 new notifications"
                />
              </ListItem>

              <Divider />

              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Earnings" 
                  secondary={`${tokenData.earned} tokens earned`}
                />
              </ListItem>

              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Purchases" 
                  secondary={`${tokenData.spent} tokens spent`}
                />
              </ListItem>

              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Referrals" 
                  secondary={`${tokenData.referralEarnings} tokens from referrals`}
                />
              </ListItem>

              <Divider />

              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  secondary="Account preferences"
                />
              </ListItem>
            </List>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'grey.50',
              textAlign: 'center'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              TIPPER v1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SideMenu; 