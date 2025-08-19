import React, { useState } from 'react';
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Paper,
  Slide,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  VideoCall as VideoCallIcon,
  LiveTv as LiveTvIcon,
  Close as CloseIcon,
  Photo as PhotoIcon,
  VideoLibrary as VideoLibraryIcon,
  Edit as EditIcon,
  AutoStories as StoryIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  LiveTv as LiveStreamIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import PhotoEditor from '../PhotoEditor/PhotoEditor';
import InstagramStyleEditor from '../AdvancedEditor/InstagramStyleEditor';

// Helper functions for safe localStorage access
const getLocalStorageItem = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

const getLocalStorageJSON = (key: string): any[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    }
    return [];
  } catch (error) {
    console.warn('localStorage not available:', error);
    return [];
  }
};

const setLocalStorageJSON = (key: string, value: any[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

interface FloatingActionButtonProps {
  onPostStory?: () => void;
  onPostPhoto?: () => void;
  onPostVideo?: () => void;
  onLiveStream?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPostStory,
  onPostPhoto,
  onPostVideo,
  onLiveStream
}) => {
  const [open, setOpen] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showInstagramEditor, setShowInstagramEditor] = useState(false);
  const [editorContentType, setEditorContentType] = useState<'post' | 'story'>('post');
  const [postType, setPostType] = useState<'story' | 'photo' | 'video' | 'livestream'>('photo');
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDemoMode } = useAuthStore();

  const actions = [
    { 
      icon: <StoryIcon />, 
      name: 'Historia', 
      action: 'story', 
      color: '#ff6b6b',
      description: 'Comparte un momento'
    },
    { 
      icon: <ImageIcon />, 
      name: 'Foto', 
      action: 'photo', 
      color: '#4ecdc4',
      description: 'Sube una imagen'
    },
    { 
      icon: <VideoIcon />, 
      name: 'Video', 
      action: 'video', 
      color: '#45b7d1',
      description: 'Comparte un video'
    },
    { 
      icon: <LiveStreamIcon />, 
      name: 'Livestream', 
      action: 'livestream', 
      color: '#ff4757',
      description: 'Transmisión en vivo'
    }
  ];

  const handleAction = (action: string) => {
    setIsHidden(true); // Hide the FAB after action is selected
    
    if (action === 'livestream') {
      onLiveStream?.();
      setOpen(false);
      return;
    }
    if (action === 'story') {
      setEditorContentType('story');
      setShowInstagramEditor(true);
      setOpen(false);
      return;
    }
    if (action === 'photo') {
      setEditorContentType('post');
      setShowInstagramEditor(true);
      setOpen(false);
      return;
    }
    setPostType(action as 'story' | 'photo' | 'video');
    setShowPostDialog(true);
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      setErrorMessage('Error al seleccionar el archivo. Intenta de nuevo.');
      setShowError(true);
    }
  };

  const handlePhotoTaken = (photoData: string, description: string) => {
    try {
      // Convert the data URL to a File object
      const byteString = atob(photoData.split(',')[1]);
      const mimeString = photoData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], 'photo.jpg', { type: mimeString });
      
      setSelectedFile(file);
      setPostContent(description);
      setPostType('photo');
      setShowPostDialog(true);
    } catch (error) {
      console.error('Error processing photo:', error);
      setErrorMessage('Error al procesar la foto. Intenta de nuevo.');
      setShowError(true);
    }
  };

  const handleInstagramEditorClose = () => {
    setShowInstagramEditor(false);
    setIsHidden(false); // Show FAB again when editor is closed
  };

  const handlePostDialogClose = () => {
    setShowPostDialog(false);
    setIsHidden(false); // Show FAB again when dialog is closed
  };

  const handleAdvancedEditorSave = (mediaData: string, description: string, type: 'photo' | 'video') => {
    try {
      const postData = {
        id: Date.now().toString(),
        content: description,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        shares: 0,
        type: editorContentType,
        file: {
          type: type,
          dataUrl: mediaData
        }
      };

      if (editorContentType === 'story') {
        // Save story to localStorage for stories bar
        const existingStories = getLocalStorageJSON('demoStories');
        const newStory = {
          ...postData,
          id: `story_${Date.now()}`,
          author: {
            _id: 'demo_user',
            username: 'demo_user',
            displayName: 'Usuario Demo',
            avatar: 'https://via.placeholder.com/40/1976d2/ffffff?text=U'
          }
        };
        setLocalStorageJSON('demoStories', [...existingStories, newStory]);
        setSuccessMessage('Historia publicada exitosamente en modo demo!');
      } else {
        // Save regular post to localStorage
        const existingPosts = getLocalStorageJSON('demoPosts');
        const newPost = {
          ...postData,
          author: {
            _id: 'demo_user',
            username: 'demo_user',
            displayName: 'Usuario Demo',
            avatar: 'https://via.placeholder.com/40/1976d2/ffffff?text=U'
          }
        };
        setLocalStorageJSON('demoPosts', [...existingPosts, newPost]);
        setSuccessMessage('Post publicado exitosamente en modo demo!');
      }
      
      setShowSuccess(true);
      setShowInstagramEditor(false);
      setIsHidden(false); // Show FAB again after saving
    } catch (error) {
      console.error('Error saving post:', error);
      setErrorMessage('Error al guardar el post. Intenta de nuevo.');
      setShowError(true);
    }
  };

  const handlePost = () => {
    if (!postContent.trim() && !selectedFile) {
      setErrorMessage('Por favor agrega contenido o una imagen/video');
      setShowError(true);
      return;
    }

    // Simulate posting in demo mode
    const postData = {
      type: postType,
      content: postContent,
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        dataUrl: '' // We'll set this below
      } : null,
      timestamp: new Date().toISOString(),
      author: {
        name: 'Demo User',
        username: 'demo_user',
        avatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=D'
      }
    };

    // If there's a file, create a data URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          postData.file!.dataUrl = dataUrl;
          
          if (postType === 'story') {
            // Save story to localStorage for stories bar
            const existingStories = getLocalStorageJSON('demoStories');
            const newStory = {
              id: Date.now(),
              ...postData,
              hasStory: true
            };
            existingStories.unshift(newStory);
            setLocalStorageJSON('demoStories', existingStories);
            
            setSuccessMessage('Historia publicada exitosamente en modo demo!');
          } else {
            // Save regular post to localStorage
            const existingPosts = getLocalStorageJSON('demoPosts');
            const newPost = {
              id: Date.now(),
              ...postData,
              likes: 0,
              comments: 0,
              shares: 0,
              isLiked: false
            };
            existingPosts.unshift(newPost);
            setLocalStorageJSON('demoPosts', existingPosts);
            
            setSuccessMessage(`${postType === 'photo' ? 'Foto' : 'Video'} publicada exitosamente en modo demo!`);
          }
          
          setShowSuccess(true);
          
          // Reset form
          setPostContent('');
          setSelectedFile(null);
          setShowPostDialog(false);
        } catch (error) {
          console.error('Error processing file:', error);
          setErrorMessage('Error al procesar el archivo. Intenta de nuevo.');
          setShowError(true);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // No file, just store the post
      if (postType === 'story') {
        // Save story to localStorage for stories bar
        const existingStories = getLocalStorageJSON('demoStories');
        const newStory = {
          id: Date.now(),
          ...postData,
          hasStory: true
        };
        existingStories.unshift(newStory);
        setLocalStorageJSON('demoStories', existingStories);
        
        setSuccessMessage('Historia publicada exitosamente en modo demo!');
      } else {
        // Save regular post to localStorage
        const existingPosts = getLocalStorageJSON('demoPosts');
        const newPost = {
          id: Date.now(),
          ...postData,
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false
        };
        existingPosts.unshift(newPost);
        setLocalStorageJSON('demoPosts', existingPosts);
        
        setSuccessMessage(`${postType === 'photo' ? 'Foto' : 'Video'} publicada exitosamente en modo demo!`);
      }
      
      setShowSuccess(true);
      
      // Reset form
      setPostContent('');
      setSelectedFile(null);
      setShowPostDialog(false);
    }
  };

  const getFileTypeText = () => {
    switch (postType) {
      case 'story': return 'imagen o video';
      case 'photo': return 'imagen';
      case 'video': return 'video';
      default: return 'archivo';
    }
  };

  return (
    <>
      {/* Main FAB Container - Centered at bottom */}
      {!isHidden && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 20 }, // Higher on mobile to avoid bottom navigation
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999, // Very high z-index to ensure visibility
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            pointerEvents: 'auto' // Ensure clicks work
          }}
        >
          {/* Action Menu - Slides up from bottom */}
          <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Paper
              elevation={8}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 1,
                minWidth: isMobile ? 280 : 400,
                justifyContent: 'center',
                mb: 1
              }}
            >
              {actions.map((action, index) => (
                <Fade in={open} timeout={300 + index * 100} key={action.action}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleAction(action.action)}
                  >
                    <IconButton
                      sx={{
                        backgroundColor: action.color,
                        color: 'white',
                        width: 48,
                        height: 48,
                        '&:hover': {
                          backgroundColor: action.color,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {action.icon}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'text.primary',
                        fontSize: '0.7rem'
                      }}
                    >
                      {action.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                        fontSize: '0.6rem',
                        maxWidth: 60,
                        lineHeight: 1.2
                      }}
                    >
                      {action.description}
                    </Typography>
                  </Box>
                </Fade>
              ))}
            </Paper>
          </Slide>

          {/* Main FAB Button */}
          <IconButton
            onClick={toggleMenu}
            data-testid="fab-button"
            sx={{
              backgroundColor: open ? 'error.main' : 'primary.main',
              color: 'white',
              width: { xs: 64, sm: 56 }, // Bigger on mobile
              height: { xs: 64, sm: 56 }, // Bigger on mobile
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: open ? 'error.dark' : 'primary.dark',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
              },
              transition: 'all 0.2s ease',
              zIndex: 10000, // Even higher z-index for the button
              border: '2px solid white', // Add border for better visibility
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
            {open ? <CloseIcon /> : <AddIcon />}
          </IconButton>
        </Box>
      )}

      {/* Post Dialog */}
      {showPostDialog && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
          onClick={() => setShowPostDialog(false)}
        >
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              maxWidth: 500,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Publicar {postType === 'story' ? 'Historia' : postType === 'photo' ? 'Foto' : 'Video'}
            </Typography>
            
            {isDemoMode && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Modo Demo: Los datos se guardan localmente para demostración
              </Alert>
            )}
            
            <Box sx={{ my: 3 }}>
              <IconButton
                sx={{
                  backgroundColor: actions.find(a => a.action === postType)?.color,
                  color: 'white',
                  width: 80,
                  height: 80,
                  mb: 2
                }}
              >
                {actions.find(a => a.action === postType)?.icon}
              </IconButton>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {postType === 'story' && 'Comparte un momento que desaparezca en 24 horas'}
                {postType === 'photo' && 'Sube una imagen para compartir con tus seguidores'}
                {postType === 'video' && 'Comparte un video con tu comunidad'}
              </Typography>
            </Box>

            {/* Content Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="¿Qué quieres compartir?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* File Upload */}
            <Box sx={{ mb: 3 }}>
              <input
                accept={postType === 'photo' ? 'image/*' : postType === 'video' ? 'video/*' : 'image/*,video/*'}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  {selectedFile ? selectedFile.name : `Seleccionar ${getFileTypeText()}`}
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Archivo seleccionado: {selectedFile.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setShowPostDialog(false)}
                sx={{ px: 3 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handlePost}
                disabled={!postContent.trim() && !selectedFile}
                sx={{ px: 3 }}
              >
                Publicar
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
              </Snackbar>
        
        {/* Photo Editor */}
        <PhotoEditor
          open={showPhotoEditor}
          onClose={() => setShowPhotoEditor(false)}
          onPhotoTaken={handlePhotoTaken}
        />

        {/* Instagram Style Editor */}
        <InstagramStyleEditor
          open={showInstagramEditor}
          onClose={handleInstagramEditorClose}
          onSave={handleAdvancedEditorSave}
          contentType={editorContentType}
        />
      </>
    );
  };

export default FloatingActionButton; 