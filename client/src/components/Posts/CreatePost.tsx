import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  TextField,
  Slider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Fab,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideocamIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Brightness4 as BrightnessIcon,
  Contrast as ContrastIcon,
  Palette as PaletteIcon,
  Refresh as RefreshIcon,
  Crop as CropIcon,
  Rotate90DegreesCcw as RotateIcon,
  Flip as FlipIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  AspectRatio as AspectRatioIcon,
  Brush as BrushIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  WbSunny as WbSunnyIcon,
  Exposure as ExposureIcon,
  Grain as GrainIcon,
  FilterAlt as FilterAltIcon,
  ArrowForward as ArrowForwardIcon,
  BlurOn as BlurOnIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Check as CheckIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  Camera as CameraCaptureIcon,
  FlipCameraIos as FlipCameraIcon
} from '@mui/icons-material';
import PhotoEditor from '../PhotoEditor/PhotoEditor';
import { useAuthStore } from '../../stores/authStore';

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const CreatePostNew: React.FC<CreatePostProps> = ({ open, onClose, onPostCreated }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<'capture' | 'edit' | 'details'>('capture');
  const [capturedMedia, setCapturedMedia] = useState<MediaFile | null>(null);
  
  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  
  // Editor states
  const [editHistory, setEditHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState<'none' | 'horizontal' | 'vertical'>('none');
  
  // Post details
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reset function
  const resetToCapture = () => {
    setCurrentStep('capture');
    setCapturedMedia(null);
    setContent('');
    setHashtags([]);
    setPrivacy('public');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setFlip('none');
    setEditHistory([]);
    setHistoryIndex(-1);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const mediaFile: MediaFile = {
        id: Date.now().toString(),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video'
      };
      setCapturedMedia(mediaFile);
      setCurrentStep('edit');
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setCameraStream(stream);
      setShowCamera(true);
      setCameraError(null);
    } catch (error) {
      setCameraError('Could not access camera');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const switchCamera = async () => {
    stopCamera();
    setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
    await startCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            const mediaFile: MediaFile = {
              id: Date.now().toString(),
              file,
              preview: URL.createObjectURL(blob),
              type: 'image'
            };
            setCapturedMedia(mediaFile);
            stopCamera();
            setCurrentStep('edit');
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Editor functions
  const applyFilter = () => {
    if (capturedMedia && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Apply filters
          context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
          context.drawImage(img, 0, 0);
          
          // Apply rotation and flip
          if (rotation !== 0 || flip !== 'none') {
            const rotatedCanvas = document.createElement('canvas');
            const rotatedContext = rotatedCanvas.getContext('2d');
            
            if (rotatedContext) {
              rotatedCanvas.width = canvas.width;
              rotatedCanvas.height = canvas.height;
              
              rotatedContext.save();
              rotatedContext.translate(canvas.width / 2, canvas.height / 2);
              rotatedContext.rotate((rotation * Math.PI) / 180);
              
              if (flip === 'horizontal') {
                rotatedContext.scale(-1, 1);
              } else if (flip === 'vertical') {
                rotatedContext.scale(1, -1);
              }
              
              rotatedContext.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
              rotatedContext.restore();
              
              // Copy back to original canvas
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(rotatedCanvas, 0, 0);
            }
          }
          
          // Save to history
          const newHistory = editHistory.slice(0, historyIndex + 1);
          newHistory.push(canvas.toDataURL());
          setEditHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        };
        img.src = capturedMedia.preview;
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setFlip('none');
  };

  // Post submission
  const handleSubmit = async () => {
    if (!capturedMedia) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      const post = {
        id: Date.now().toString(),
        content,
        media: [capturedMedia],
        hashtags,
        privacy,
        author: user,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        shares: []
      };
      
      onPostCreated(post);
      onClose();
      resetToCapture();
      
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (currentStep === 'capture') {
      onClose();
      resetToCapture();
    } else {
      setCurrentStep('capture');
      resetToCapture();
    }
  };

  const steps = [
    { label: 'Capture', description: 'Take a photo or video' },
    { label: 'Edit', description: 'Edit your media' },
    { label: 'Details', description: 'Add caption and settings' }
  ];

  const stepIndex = ['capture', 'edit', 'details'].indexOf(currentStep);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          {currentStep !== 'capture' && (
            <IconButton onClick={() => setCurrentStep('capture')} size="small">
              <BackIcon />
            </IconButton>
          )}
          <Typography variant="h6">Create Post</Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stepper activeStep={stepIndex} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
        {/* Step 1: Capture */}
        {currentStep === 'capture' && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <PhotoCameraIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Choose Photo/Video
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select from your gallery
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                    onClick={startCamera}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <CameraIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Take Photo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use your camera
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Step 2: Edit */}
        {currentStep === 'edit' && capturedMedia && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Media Preview */}
            <Box sx={{ flex: 1, position: 'relative', bgcolor: 'black' }}>
              <img 
                src={capturedMedia.preview} 
                alt="Captured media"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }}
              />
              <canvas 
                ref={canvasRef}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%',
                  pointerEvents: 'none'
                }}
              />
            </Box>

            {/* Editor Controls */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Adjustments
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Brightness</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BrightnessIcon fontSize="small" />
                    <Slider
                      value={brightness}
                      onChange={(e, value) => setBrightness(value as number)}
                      min={0}
                      max={200}
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Contrast</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContrastIcon fontSize="small" />
                    <Slider
                      value={contrast}
                      onChange={(e, value) => setContrast(value as number)}
                      min={0}
                      max={200}
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Saturation</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon fontSize="small" />
                    <Slider
                      value={saturation}
                      onChange={(e, value) => setSaturation(value as number)}
                      min={0}
                      max={200}
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Blur</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BlurOnIcon fontSize="small" />
                    <Slider
                      value={blur}
                      onChange={(e, value) => setBlur(value as number)}
                      min={0}
                      max={20}
                      valueLabelDisplay="auto"
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<UndoIcon />}
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  Undo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RedoIcon />}
                  onClick={redo}
                  disabled={historyIndex >= editHistory.length - 1}
                >
                  Redo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CheckIcon />}
                  onClick={() => setCurrentStep('details')}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 3: Details */}
        {currentStep === 'details' && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* Media Preview */}
            {capturedMedia && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={capturedMedia.preview} 
                  alt="Media preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                />
              </Box>
            )}

            {/* Content Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Hashtags */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Hashtags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {hashtags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => setHashtags(hashtags.filter((_, i) => i !== index))}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Privacy Settings */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Privacy
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={privacy === 'public' ? 'contained' : 'outlined'}
                  startIcon={<PublicIcon />}
                  onClick={() => setPrivacy('public')}
                  size="small"
                >
                  Public
                </Button>
                <Button
                  variant={privacy === 'friends' ? 'contained' : 'outlined'}
                  startIcon={<PeopleIcon />}
                  onClick={() => setPrivacy('friends')}
                  size="small"
                >
                  Friends
                </Button>
                <Button
                  variant={privacy === 'private' ? 'contained' : 'outlined'}
                  startIcon={<LockIcon />}
                  onClick={() => setPrivacy('private')}
                  size="small"
                >
                  Private
                </Button>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              {isSubmitting && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" color="text.secondary">
                    Uploading... {uploadProgress}%
                  </Typography>
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || !capturedMedia}
                startIcon={<SaveIcon />}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Camera Modal */}
      {showCamera && (
        <Dialog
          open={showCamera}
          onClose={stopCamera}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'black',
              borderRadius: 0
            }
          }}
        >
          <Box sx={{ position: 'relative', height: '70vh' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Camera Controls */}
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2
            }}>
              <IconButton
                onClick={stopCamera}
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
              >
                <CloseIcon />
              </IconButton>
              
              <Fab
                color="primary"
                onClick={capturePhoto}
                sx={{ width: 80, height: 80 }}
              >
                <CameraCaptureIcon />
              </Fab>
              
              <IconButton
                onClick={switchCamera}
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
              >
                <FlipCameraIcon />
              </IconButton>
            </Box>
          </Box>
        </Dialog>
      )}
    </Dialog>
  );
};

export default CreatePostNew; 