import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  Chip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Pin as PinIcon
} from '@mui/icons-material';
import { ChatConversation } from '../../types/chat';

interface ChatListProps {
  onSelectChat: (conversation: ChatConversation) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Mock chat conversations
  const conversations: ChatConversation[] = [
    {
      _id: '1',
      type: 'direct',
      participants: [
        {
          _id: '2',
          username: 'johndoe',
          displayName: 'John Doe',
          avatar: 'https://via.placeholder.com/40/667eea/ffffff?text=JD'
        }
      ],
      lastMessage: {
        _id: 'msg1',
        conversationId: '1',
        sender: {
          _id: '2',
          username: 'johndoe',
          displayName: 'John Doe',
          avatar: 'https://via.placeholder.com/40/667eea/ffffff?text=JD'
        },
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false
      },
      unreadCount: 0,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      type: 'direct',
      participants: [
        {
          _id: '3',
          username: 'janesmith',
          displayName: 'Jane Smith',
          avatar: 'https://via.placeholder.com/40/4ecdc4/ffffff?text=JS'
        }
      ],
      lastMessage: {
        _id: 'msg2',
        conversationId: '2',
        sender: {
          _id: '3',
          username: 'janesmith',
          displayName: 'Jane Smith',
          avatar: 'https://via.placeholder.com/40/4ecdc4/ffffff?text=JS'
        },
        content: 'Image',
        mediaType: 'image',
        mediaUrl: 'https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Image',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false
      },
      unreadCount: 1,
      isPinned: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '3',
      type: 'direct',
      participants: [
        {
          _id: '4',
          username: 'tipperteam',
          displayName: 'TIPPER Team',
          avatar: 'https://via.placeholder.com/40/45b7d1/ffffff?text=TT'
        }
      ],
      lastMessage: {
        _id: 'msg3',
        conversationId: '3',
        sender: {
          _id: '4',
          username: 'tipperteam',
          displayName: 'TIPPER Team',
          avatar: 'https://via.placeholder.com/40/45b7d1/ffffff?text=TT'
        },
        content: 'Great work on the new features! 🎉',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true
      },
      unreadCount: 0,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const filteredConversations = conversations.filter(conv => 
    conv.participants[0].displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.lastMessage && conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getMessagePreview = (conversation: ChatConversation) => {
    if (!conversation.lastMessage) {
      return 'No messages yet';
    }

    if (conversation.lastMessage.mediaType === 'image') {
      return '📷 Image';
    } else if (conversation.lastMessage.mediaType === 'video') {
      return '🎥 Video';
    } else if (conversation.lastMessage.mediaType === 'audio') {
      return '🎵 Audio';
    } else if (conversation.lastMessage.mediaType === 'file') {
      return '📎 File';
    } else {
      return conversation.lastMessage.content;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>

      {/* Chat List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredConversations.map((conversation) => (
            <ListItem
              key={conversation._id}
              button
              onClick={() => onSelectChat(conversation)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'grey.50'
                }
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={conversation.unreadCount}
                  color="error"
                  invisible={conversation.unreadCount === 0}
                >
                  <Avatar
                    src={conversation.participants[0].avatar}
                    sx={{ width: 48, height: 48 }}
                  >
                    {conversation.participants[0].displayName.charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        color: conversation.unreadCount > 0 ? 'text.primary' : 'text.primary'
                      }}
                    >
                      {conversation.participants[0].displayName}
                    </Typography>
                    {conversation.isPinned && (
                      <PinIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '70%'
                      }}
                    >
                      {getMessagePreview(conversation)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', ml: 1 }}
                    >
                      {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ''}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList; 