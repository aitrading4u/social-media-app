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
import { Close as CloseIcon, Message as MessageIcon } from '@mui/icons-material';

interface MessagesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MessagesDrawer: React.FC<MessagesDrawerProps> = ({ open, onClose }) => {
  // Mock data for messages
  const messages = [
    { id: 1, sender: 'John Doe', message: 'Hey! How are you doing?', time: '2m ago', avatar: 'J' },
    { id: 2, sender: 'Jane Smith', message: 'Did you see the new post?', time: '5m ago', avatar: 'J' },
    { id: 3, sender: 'Mike Johnson', message: 'Great work on the project!', time: '1h ago', avatar: 'M' },
    { id: 4, sender: 'Sarah Chen', message: 'Can we meet tomorrow?', time: '2h ago', avatar: 'S' },
    { id: 5, sender: 'Alex Rodriguez', message: 'Thanks for the help!', time: '3h ago', avatar: 'A' }
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
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon color="primary" />
            Messages
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Messages List */}
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {message.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={message.sender}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {message.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < messages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default MessagesDrawer; 