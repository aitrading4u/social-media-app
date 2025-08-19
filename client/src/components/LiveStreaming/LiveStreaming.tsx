import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  LiveTv as LiveIcon,
  Videocam as CameraIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VideocamOff as CameraOffIcon,
  Send as SendIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  People as ViewersIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface LiveStream {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  title: string;
  description?: string;
  thumbnail: string;
  streamUrl: string;
  isLive: boolean;
  viewers: number;
  likes: number;
  isLiked: boolean;
  startedAt: Date;
  tags: string[];
  category: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isModerator?: boolean;
}

interface LiveStreamingProps {
  onStreamClick?: (stream: LiveStream) => void;
}

const LiveStreaming: React.FC<LiveStreamingProps> = ({ onStreamClick }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [showStreamViewer, setShowStreamViewer] = useState(false);
  const [showCreateStream, setShowCreateStream] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamCategory, setStreamCategory] = useState('gaming');
  const [streamTags, setStreamTags] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock live streams data
  const mockStreams: LiveStream[] = [
    {
      id: '1',
      userId: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
      title: 'Coding Live: Building a Social Network',
      description: 'Join me as I build a social network from scratch using React and Node.js!',
      thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=Live+Coding',
      streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      isLive: true,
      viewers: 1247,
      likes: 89,
      isLiked: false,
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
      tags: ['coding', 'react', 'webdev'],
      category: 'technology'
    },
    {
      id: '2',
      userId: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS',
      title: 'Design Workshop: UI/UX Best Practices',
      description: 'Learn the latest design trends and best practices for modern web applications.',
      thumbnail: 'https://via.placeholder.com/400x225/4ecdc4/ffffff?text=Design+Workshop',
      streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      isLive: true,
      viewers: 892,
      likes: 156,
      isLiked: true,
      startedAt: new Date(Date.now() - 15 * 60 * 1000),
      tags: ['design', 'ui', 'ux'],
      category: 'design'
    },
    {
      id: '3',
      userId: '3',
      username: 'mikejohnson',
      displayName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ',
      title: 'Gaming: Valorant Tournament',
      description: 'Competitive Valorant gameplay with commentary and tips!',
      thumbnail: 'https://via.placeholder.com/400x225/ff6b6b/ffffff?text=Gaming+Stream',
      streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      isLive: true,
      viewers: 2341,
      likes: 567,
      isLiked: false,
      startedAt: new Date(Date.now() - 5 * 60 * 1000),
      tags: ['gaming', 'valorant', 'esports'],
      category: 'gaming'
    }
  ];

  // Mock chat messages
  const mockChatMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
      message: 'Great stream! Love the coding content 🚀',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      userId: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS',
      message: 'Can you explain the React hooks part again?',
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    },
    {
      id: '3',
      userId: '3',
      username: 'mikejohnson',
      displayName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ',
      message: 'This is amazing! Following for more content',
      timestamp: new Date(Date.now() - 30 * 1000)
    }
  ];

  useEffect(() => {
    setStreams(mockStreams);
    setChatMessages(mockChatMessages);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleStreamClick = (stream: LiveStream) => {
    setSelectedStream(stream);
    setShowStreamViewer(true);
    onStreamClick?.(stream);
  };

  const closeStreamViewer = () => {
    setShowStreamViewer(false);
    setSelectedStream(null);
    setIsStreaming(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleLikeStream = () => {
    if (!selectedStream) return;
    
    setStreams(prev => prev.map(stream => {
      if (stream.id === selectedStream.id) {
        return {
          ...stream,
          isLiked: !stream.isLiked,
          likes: stream.isLiked ? stream.likes - 1 : stream.likes + 1
        };
      }
      return stream;
    }));

    setSelectedStream(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    } : null);
  };

  const handleShareStream = () => {
    if (!selectedStream) return;
    
    navigator.clipboard.writeText(`${window.location.origin}/live/${selectedStream.id}`);
    showSnackbar('Stream link copied to clipboard!', 'success');
  };

  const handleChatMessage = () => {
    if (!chatInput.trim() || !selectedStream) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || '1',
      username: user?.username || 'demo_user',
      displayName: user?.displayName || 'Demo User',
      avatar: user?.avatar || 'https://via.placeholder.com/150/667eea/ffffff?text=DU',
      message: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
  };

  const startStream = async () => {
    if (!streamTitle.trim()) return;

    setIsUploading(true);
    try {
      // Simulate stream setup
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newStream: LiveStream = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id || '1',
        username: user?.username || 'demo_user',
        displayName: user?.displayName || 'Demo User',
        avatar: user?.avatar || 'https://via.placeholder.com/150/667eea/ffffff?text=DU',
        title: streamTitle,
        description: streamDescription,
        thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=Live+Stream',
        streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isLive: true,
        viewers: 0,
        likes: 0,
        isLiked: false,
        startedAt: new Date(),
        tags: streamTags,
        category: streamCategory
      };

      setStreams(prev => [newStream, ...prev]);
      setShowCreateStream(false);
      setStreamTitle('');
      setStreamDescription('');
      setStreamTags([]);
      setStreamCategory('gaming');
      showSnackbar('Stream started successfully!', 'success');
    } catch (error) {
      console.error('Error starting stream:', error);
      showSnackbar('Error starting stream', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const newTag = event.currentTarget.value.trim();
      if (!streamTags.includes(newTag)) {
        setStreamTags(prev => [...prev, newTag]);
      }
      event.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStreamTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const categories = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'music', label: 'Music' },
    { value: 'education', label: 'Education' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  return (
    <>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <LiveIcon color="error" />
            Live Streams
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<CameraIcon />}
            onClick={() => setShowCreateStream(true)}
            sx={{ borderRadius: 2 }}
          >
            Go Live
          </Button>
        </Box>

        {/* Live Streams Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {streams.map((stream) => (
            <Card
              key={stream.id}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  transition: 'all 0.3s ease-in-out'
                }
              }}
              onClick={() => handleStreamClick(stream)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={stream.thumbnail}
                  alt={stream.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <LiveIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    LIVE
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <ViewersIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">
                    {stream.viewers.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar src={stream.avatar} sx={{ width: 32, height: 32 }}>
                    {stream.displayName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {stream.displayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stream.viewers.toLocaleString()} viewers
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    handleLikeStream();
                  }}>
                    {stream.isLiked ? <LikeIcon color="error" /> : <LikeOutlineIcon />}
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {stream.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stream.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {stream.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Empty State */}
        {streams.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LiveIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No live streams right now
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to go live and start streaming!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Stream Viewer */}
      <Dialog
        open={showStreamViewer}
        onClose={closeStreamViewer}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            backgroundColor: 'black'
          }
        }}
      >
        {selectedStream && (
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Video Section */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              {/* Video Player */}
              <video
                ref={videoRef}
                src={selectedStream.streamUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                autoPlay
                muted={isMuted}
              />

              {/* Stream Info Overlay */}
              <Box sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={selectedStream.avatar} sx={{ width: 40, height: 40 }}>
                    {selectedStream.displayName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {selectedStream.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {selectedStream.displayName} • {selectedStream.viewers.toLocaleString()} viewers
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handleLikeStream} sx={{ color: 'white' }}>
                    {selectedStream.isLiked ? <LikeIcon color="error" /> : <LikeOutlineIcon />}
                  </IconButton>
                  <IconButton onClick={handleShareStream} sx={{ color: 'white' }}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton onClick={closeStreamViewer} sx={{ color: 'white' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Video Controls */}
              <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <IconButton onClick={() => setIsMuted(!isMuted)} sx={{ color: 'white' }}>
                  {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
                </IconButton>
                <IconButton onClick={() => setIsVideoOff(!isVideoOff)} sx={{ color: 'white' }}>
                  {isVideoOff ? <CameraOffIcon /> : <CameraIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Chat Section */}
            <Box sx={{ width: 350, backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                <Tab label="Chat" />
                <Tab label="Info" />
              </Tabs>

              {activeTab === 0 && (
                <>
                  {/* Chat Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <List sx={{ py: 0 }}>
                      {chatMessages.map((message) => (
                        <ListItem key={message.id} sx={{ px: 0, py: 0.5 }}>
                          <ListItemAvatar>
                            <Avatar src={message.avatar} sx={{ width: 32, height: 32 }}>
                              {message.displayName.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {message.displayName}
                                </Typography>
                                {message.isModerator && (
                                  <Chip label="MOD" size="small" color="primary" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2">
                                {message.message}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                      <div ref={chatEndRef} />
                    </List>
                  </Box>

                  {/* Chat Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                      />
                      <IconButton onClick={handleChatMessage} disabled={!chatInput.trim()}>
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}

              {activeTab === 1 && (
                <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    About this stream
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedStream.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {selectedStream.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Stream Info
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started: {selectedStream.startedAt.toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {selectedStream.category}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Create Stream Dialog */}
      <Dialog
        open={showCreateStream}
        onClose={() => setShowCreateStream(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Start Live Stream
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="What are you streaming today?"
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={streamDescription}
              onChange={(e) => setStreamDescription(e.target.value)}
              placeholder="Tell viewers what to expect..."
            />

            <TextField
              select
              fullWidth
              label="Category"
              value={streamCategory}
              onChange={(e) => setStreamCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Tags"
              placeholder="Press Enter to add tags"
              onKeyPress={handleTagInput}
            />

            {streamTags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {streamTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            )}

            {isUploading && (
              <Box>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  Setting up your stream...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateStream(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={startStream}
            disabled={!streamTitle.trim() || isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : <LiveIcon />}
          >
            {isUploading ? 'Starting...' : 'Go Live'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LiveStreaming; 