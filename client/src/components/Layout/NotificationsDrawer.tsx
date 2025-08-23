import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Notifications as NotificationsIcon,
  Favorite as LikeIcon,
  Comment as CommentIcon,
  PersonAdd as FollowIcon
} from '@mui/icons-material';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ open, onClose }) => {
  const notifications = [
    { 
      id: 1, 
      type: 'like', 
      user: 'John Doe', 
      action: 'liked your post', 
      time: '1m ago', 
      avatar: 'J',
      icon: <LikeIcon color="error" />
    },
    { 
      id: 2, 
      type: 'comment', 
      user: 'Jane Smith', 
      action: 'commented on your post', 
      time: '3m ago', 
      avatar: 'J',
      icon: <CommentIcon color="primary" />
    },
    { 
      id: 3, 
      type: 'follow', 
      user: 'Mike Johnson', 
      action: 'started following you', 
      time: '10m ago', 
      avatar: 'M',
      icon: <FollowIcon color="success" />
    }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon color="primary" />
            Notifications
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {notification.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {notification.user}
                      </Typography>
                      {notification.icon}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default NotificationsDrawer; 