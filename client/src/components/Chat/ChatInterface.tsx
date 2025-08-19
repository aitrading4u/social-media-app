import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Paper,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { ChatConversation, ChatMessage } from '../../types/chat';
import MessageInput from './MessageInput';
import VoiceMessagePlayer from './VoiceMessagePlayer';

interface ChatInterfaceProps {
  conversation: ChatConversation;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversation, onClose }) => {
  const [showCallNotification, setShowCallNotification] = useState(false);
  const [showVideoCallNotification, setShowVideoCallNotification] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      _id: '1',
      conversationId: conversation._id,
      sender: {
        _id: 'current-user',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://via.placeholder.com/32/667eea/ffffff?text=JD'
      },
      content: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: true
    },
    {
      _id: '2',
      conversationId: conversation._id,
      sender: conversation.participants[0],
      content: 'I\'m doing great! Just exploring TIPPER. This platform is amazing! 🚀',
      timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      isRead: true
    },
    {
      _id: '3',
      conversationId: conversation._id,
      sender: {
        _id: 'current-user',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://via.placeholder.com/32/667eea/ffffff?text=JD'
      },
      content: 'Right? The tipping system is revolutionary! 💰',
      timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      isRead: false
    },
    {
      _id: '4',
      conversationId: conversation._id,
      sender: conversation.participants[0],
      content: 'Mira esta foto que tomé!',
      mediaType: 'image',
      mediaUrl: 'https://via.placeholder.com/400/300/667eea/ffffff?text=Photo+Example',
      timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      isRead: false
    },
    {
      _id: '5',
      conversationId: conversation._id,
      sender: {
        _id: 'current-user',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://via.placeholder.com/32/667eea/ffffff?text=JD'
      },
      content: 'Te envío un mensaje de voz',
      mediaType: 'audio',
      mediaUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      timestamp: new Date(Date.now() - 15 * 1000), // 15 seconds ago
      isRead: false
    }
  ]);

  const theme = useTheme();

  const handleSendMessage = (content: string, mediaType?: string, mediaUrl?: string) => {
    if (content.trim() || mediaUrl) {
      const newMessage: ChatMessage = {
        _id: Date.now().toString(),
        conversationId: conversation._id,
        sender: {
          _id: 'current-user',
          username: 'johndoe',
          displayName: 'John Doe',
          avatar: 'https://via.placeholder.com/32/667eea/ffffff?text=JD'
        },
        content: content.trim(),
        mediaType: mediaType as any,
        mediaUrl: mediaUrl,
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages([...messages, newMessage]);
    }
  };

  const handleCall = () => {
    setShowCallNotification(true);
    // Simulate call functionality
    console.log('Iniciando llamada con:', conversation.participants[0].displayName);
  };

  const handleVideoCall = () => {
    setShowVideoCallNotification(true);
    // Simulate video call functionality
    console.log('Iniciando videollamada con:', conversation.participants[0].displayName);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.mediaType === 'image') {
      return (
        <Box>
          <img 
            src={msg.mediaUrl} 
            alt="Shared image"
            style={{ 
              maxWidth: 200, 
              maxHeight: 200, 
              borderRadius: 8,
              cursor: 'pointer'
            }}
          />
          {msg.content && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {msg.content}
            </Typography>
          )}
        </Box>
      );
    } else if (msg.mediaType === 'video') {
      return (
        <Box>
          <video 
            src={msg.mediaUrl}
            controls
            style={{ 
              maxWidth: 200, 
              maxHeight: 200, 
              borderRadius: 8 
            }}
          />
          {msg.content && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {msg.content}
            </Typography>
          )}
        </Box>
      );
    } else if (msg.mediaType === 'audio') {
      return (
        <Box>
          <VoiceMessagePlayer 
            audioUrl={msg.mediaUrl || ''} 
            isOwnMessage={msg.sender._id === 'current-user'}
          />
          {msg.content && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {msg.content}
            </Typography>
          )}
        </Box>
      );
    } else if (msg.mediaType === 'file') {
      return (
        <Box>
          <Paper sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              📎 Archivo adjunto
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {msg.mediaUrl}
            </Typography>
          </Paper>
          {msg.content && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {msg.content}
            </Typography>
          )}
        </Box>
      );
    } else {
      return (
        <Typography variant="body2">
          {msg.content}
        </Typography>
      );
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'white'
        }}
      >
        <IconButton onClick={onClose} size="small">
          <ArrowBackIcon />
        </IconButton>
        
        <Avatar
          src={conversation.participants[0].avatar}
          sx={{ width: 40, height: 40 }}
        >
          {conversation.participants[0].displayName.charAt(0)}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {conversation.participants[0].displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {conversation.participants.length} participants
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            sx={{ color: 'primary.main' }}
            onClick={handleCall}
          >
            <CallIcon />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: 'primary.main' }}
            onClick={handleVideoCall}
          >
            <VideoCallIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((msg) => {
          const isOwnMessage = msg.sender._id === 'current-user';
          
          return (
            <Box
              key={msg._id}
              sx={{
                display: 'flex',
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                    color: isOwnMessage ? 'white' : 'text.primary',
                    borderRadius: 2,
                    wordBreak: 'break-word'
                  }}
                >
                  {renderMessageContent(msg)}
                </Paper>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.7rem'
                  }}
                >
                  {formatTime(msg.timestamp)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />

      {/* Notifications */}
      <Snackbar
        open={showCallNotification}
        autoHideDuration={3000}
        onClose={() => setShowCallNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCallNotification(false)} 
          severity="info" 
          sx={{ width: '100%' }}
        >
          📞 Iniciando llamada con {conversation.participants[0].displayName}...
        </Alert>
      </Snackbar>

      <Snackbar
        open={showVideoCallNotification}
        autoHideDuration={3000}
        onClose={() => setShowVideoCallNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowVideoCallNotification(false)} 
          severity="info" 
          sx={{ width: '100%' }}
        >
          📹 Iniciando videollamada con {conversation.participants[0].displayName}...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatInterface; 