import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  LinearProgress,
  useTheme,
  alpha,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  Send as SendIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

interface Story {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  media: {
    type: 'image' | 'video';
    url: string;
  };
  caption?: string;
  hashtags?: string[];
  createdAt: Date;
  expiresAt: Date;
  views: number;
  likes: number;
  isLiked: boolean;
  isViewed: boolean;
}

interface StoriesBarProps {
  onStoryClick?: (story: Story) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ onStoryClick }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyHashtags, setStoryHashtags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock stories data
  const mockStories: Story[] = [
    {
      id: '1',
      userId: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
      media: {
        type: 'image',
        url: 'https://via.placeholder.com/400x600/667eea/ffffff?text=Story+1'
      },
      caption: 'Amazing coding session today! 💻',
      hashtags: ['coding', 'webdev'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
      views: 45,
      likes: 12,
      isLiked: false,
      isViewed: false
    },
    {
      id: '2',
      userId: '2',
      username: 'janesmith',
      displayName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=JS',
      media: {
        type: 'image',
        url: 'https://via.placeholder.com/400x600/4ecdc4/ffffff?text=Story+2'
      },
      caption: 'New design inspiration ✨',
      hashtags: ['design', 'inspiration'],
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
      views: 78,
      likes: 23,
      isLiked: true,
      isViewed: true
    },
    {
      id: '3',
      userId: '3',
      username: 'mikejohnson',
      displayName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=MJ',
      media: {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      },
      caption: 'Sunset vibes 🌅',
      hashtags: ['sunset', 'photography'],
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
      views: 156,
      likes: 45,
      isLiked: false,
      isViewed: false
    }
  ];

  useEffect(() => {
    setStories(mockStories);
  }, []);

  useEffect(() => {
    if (showStoryViewer && selectedStory) {
      startProgress();
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [showStoryViewer, selectedStory]);

  const startProgress = () => {
    setProgress(0);
    setIsPlaying(true);
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total duration
  };

  const pauseProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsPlaying(false);
  };

  const resumeProgress = () => {
    setIsPlaying(true);
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 50);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setSelectedStory(stories[currentStoryIndex + 1]);
      setProgress(0);
    } else {
      closeStoryViewer();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setSelectedStory(stories[currentStoryIndex - 1]);
      setProgress(0);
    }
  };

  const handleStoryClick = (story: Story) => {
    const storyIndex = stories.findIndex(s => s.id === story.id);
    setCurrentStoryIndex(storyIndex);
    setSelectedStory(story);
    setShowStoryViewer(true);
    onStoryClick?.(story);
  };

  const closeStoryViewer = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPlaying(true);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleLikeStory = () => {
    if (!selectedStory) return;
    
    setStories(prev => prev.map(story => {
      if (story.id === selectedStory.id) {
        return {
          ...story,
          isLiked: !story.isLiked,
          likes: story.isLiked ? story.likes - 1 : story.likes + 1
        };
      }
      return story;
    }));

    setSelectedStory(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    } : null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStoryFile(file);
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setStoryCaption(text);
    
    // Auto-detect hashtags
    const hashtagRegex = /#[\w]+/g;
    const detectedHashtags = text.match(hashtagRegex) || [];
    setStoryHashtags(detectedHashtags.map(tag => tag.slice(1)));
  };

  const createStory = async () => {
    if (!storyFile) return;

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newStory: Story = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id || '1',
        username: user?.username || 'demo_user',
        displayName: user?.displayName || 'Demo User',
        avatar: user?.avatar || 'https://via.placeholder.com/150/667eea/ffffff?text=DU',
        media: {
          type: storyFile.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(storyFile)
        },
        caption: storyCaption,
        hashtags: storyHashtags,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        views: 0,
        likes: 0,
        isLiked: false,
        isViewed: false
      };

      setStories(prev => [newStory, ...prev]);
      setShowCreateStory(false);
      setStoryFile(null);
      setStoryCaption('');
      setStoryHashtags([]);
      showSnackbar('Story created successfully!', 'success');
    } catch (error) {
      console.error('Error creating story:', error);
      showSnackbar('Error creating story', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        p: 2, 
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {/* Create Story Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `3px solid ${theme.palette.primary.main}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
            onClick={() => setShowCreateStory(true)}
          >
            <AddIcon color="primary" />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
            Add Story
          </Typography>
        </Box>

        {/* Stories */}
        {stories.map((story) => (
          <Box 
            key={story.id}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              minWidth: 80,
              cursor: 'pointer'
            }}
            onClick={() => handleStoryClick(story)}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: `3px solid ${story.isViewed ? theme.palette.grey[300] : theme.palette.primary.main}`,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <Avatar
                src={story.avatar}
                sx={{ width: '100%', height: '100%' }}
              >
                {story.displayName.charAt(0)}
              </Avatar>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1, 
                textAlign: 'center',
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {story.displayName}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Story Viewer */}
      <Dialog
        open={showStoryViewer}
        onClose={closeStoryViewer}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            borderRadius: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            m: 0
          }
        }}
      >
        {selectedStory && (
          <>
            {/* Progress Bar */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 3,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }} 
              />
            </Box>

            {/* Header */}
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
                <Avatar src={selectedStory.avatar} sx={{ width: 40, height: 40 }}>
                  {selectedStory.displayName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                    {selectedStory.displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedStory.createdAt.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
              
              <IconButton onClick={closeStoryViewer} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Story Content */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              position: 'relative'
            }}>
              {selectedStory.media.type === 'image' ? (
                <img
                  src={selectedStory.media.url}
                  alt="Story"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <video
                  src={selectedStory.media.url}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onPlay={() => resumeProgress()}
                  onPause={() => pauseProgress()}
                  autoPlay
                />
              )}

              {/* Navigation Buttons */}
              <IconButton
                onClick={prevStory}
                disabled={currentStoryIndex === 0}
                sx={{
                  position: 'absolute',
                  left: 20,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }
                }}
              >
                <PrevIcon />
              </IconButton>

              <IconButton
                onClick={nextStory}
                disabled={currentStoryIndex === stories.length - 1}
                sx={{
                  position: 'absolute',
                  right: 20,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }
                }}
              >
                <NextIcon />
              </IconButton>
            </Box>

            {/* Caption */}
            {selectedStory.caption && (
              <Box sx={{ 
                position: 'absolute', 
                bottom: 100, 
                left: 20, 
                right: 20,
                zIndex: 1
              }}>
                <Typography variant="body1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  {selectedStory.caption}
                </Typography>
                {selectedStory.hashtags && selectedStory.hashtags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {selectedStory.hashtags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: 20, 
              right: 20,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <TextField
                placeholder="Send message..."
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20
                  }
                }}
              />
              <IconButton sx={{ color: 'white' }}>
                <SendIcon />
              </IconButton>
              <IconButton onClick={handleLikeStory} sx={{ color: 'white' }}>
                {selectedStory.isLiked ? <LikeIcon color="error" /> : <LikeOutlineIcon />}
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <MoreIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Dialog>

      {/* Create Story Dialog */}
      <Dialog
        open={showCreateStory}
        onClose={() => setShowCreateStory(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Create Story
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* File Upload */}
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              {storyFile ? (
                <Box>
                  <Typography variant="subtitle1">
                    {storyFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(storyFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="subtitle1">
                    Click to upload photo or video
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports JPG, PNG, MP4
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Caption */}
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a caption..."
              value={storyCaption}
              onChange={handleCaptionChange}
            />

            {/* Hashtags */}
            {storyHashtags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {storyHashtags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <Box>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  Uploading story...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateStory(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={createStory}
            disabled={!storyFile || isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : null}
          >
            {isUploading ? 'Creating...' : 'Create Story'}
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

export default StoriesBar; 