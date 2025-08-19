import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Badge,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  AccountBalance as TokenIcon
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'tip' | 'mention';
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  postId?: string;
}

const NotificationsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      user: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40/667eea/ffffff?text=JD'
      },
      content: 'liked your post',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      postId: 'post1'
    },
    {
      id: '2',
      type: 'comment',
      user: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40/4ecdc4/ffffff?text=JS'
      },
      content: 'commented on your post: "Amazing content! 🚀"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      postId: 'post1'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Tech Guru',
        avatar: 'https://via.placeholder.com/40/45b7d1/ffffff?text=TG'
      },
      content: 'started following you',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true
    },
    {
      id: '4',
      type: 'tip',
      user: {
        name: 'Maria Garcia',
        avatar: 'https://via.placeholder.com/40/f0932b/ffffff?text=MG'
      },
      content: 'tipped you 50 tokens',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '5',
      type: 'mention',
      user: {
        name: 'Carlos Lopez',
        avatar: 'https://via.placeholder.com/40/6c5ce7/ffffff?text=CL'
      },
      content: 'mentioned you in a comment',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      postId: 'post2'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon sx={{ color: 'error.main' }} />;
      case 'comment':
        return <CommentIcon sx={{ color: 'primary.main' }} />;
      case 'follow':
        return <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>👤</Avatar>;
      case 'tip':
        return <TokenIcon sx={{ color: 'success.main' }} />;
      case 'mention':
        return <ShareIcon sx={{ color: 'warning.main' }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'error';
      case 'comment':
        return 'primary';
      case 'follow':
        return 'info';
      case 'tip':
        return 'success';
      case 'mention':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <>
      {/* Floating Notifications Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 180, // Positioned above the messaging button
          right: 20,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={() => setIsOpen(true)}
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
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Notifications Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
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
        <Box
          sx={{
            width: isMobile ? '100%' : 400,
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
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
              <NotificationsIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Notifications
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Notifications List */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={notification.user.avatar}
                      sx={{ width: 40, height: 40 }}
                    >
                      {notification.user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {notification.user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notification.content}
                        </Typography>
                        {!notification.isRead && (
                          <Chip
                            label="New"
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        {getNotificationIcon(notification.type)}
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
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
              {unreadCount} unread notifications
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationsApp; 