import React, { useState } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ChatList from './ChatList';
import ChatInterface from './ChatInterface';
import { ChatConversation } from '../../types/chat';

interface Chat {
  conversation: ChatConversation;
  isOpen: boolean;
}

const MessagingApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenChat = (conversation: ChatConversation) => {
    setSelectedChat(conversation);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 100, // Positioned below the notifications button
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
          <Badge badgeContent={5} color="error">
            <ChatIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Messaging Drawer */}
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
              <ChatIcon />
              <Box sx={{ fontWeight: 'bold' }}>Messages</Box>
            </Box>
            <IconButton
              onClick={toggleDrawer}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, display: 'flex' }}>
            {selectedChat ? (
              <ChatInterface
                conversation={selectedChat}
                onClose={handleCloseChat}
              />
            ) : (
              <ChatList onSelectChat={handleOpenChat} />
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MessagingApp; 