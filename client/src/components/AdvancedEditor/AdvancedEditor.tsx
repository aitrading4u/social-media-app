import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Paper,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Camera as CameraIcon,
  Filter as FilterIcon,
  AutoAwesome as AIIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideoCallIcon,
  TextFields as TextIcon,
  EmojiEmotions as StickerIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface AdvancedEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (mediaData: string, description: string, type: 'photo' | 'video') => void;
  contentType: 'post' | 'story';
}

interface Sticker {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

const AdvancedEditor: React.FC<AdvancedEditorProps> = ({ 
  open, 
  onClose, 
  onSave, 
  contentType 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [processedMedia, setProcessedMedia] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample filters
  const filters = [
    { id: 'normal', name: 'Normal', filter: 'none' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(0.8) hue-rotate(30deg)' },
    { id: 'blackwhite', name: 'B&W', filter: 'grayscale(1)' },
    { id: 'warm', name: 'Warm', filter: 'sepia(0.3) brightness(1.1)' },
    { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
    { id: 'dramatic', name: 'Dramatic', filter: 'contrast(1.3) brightness(0.8)' },
    { id: 'bright', name: 'Bright', filter: 'brightness(1.3) saturate(1.2)' },
    { id: 'soft', name: 'Soft', filter: 'blur(0.5px) brightness(1.1)' }
  ];

  // Sample stickers
  const stickers: Sticker[] = [
    { id: 'heart', name: '❤️', url: '❤️', category: 'emotions' },
    { id: 'star', name: '⭐', url: '⭐', category: 'emotions' },
    { id: 'fire', name: '🔥', url: '🔥', category: 'emotions' },
    { id: 'thumbsup', name: '👍', url: '👍', category: 'emotions' },
    { id: 'crown', name: '👑', url: '👑', category: 'objects' },
    { id: 'camera', name: '📷', url: '📷', category: 'objects' },
    { id: 'music', name: '🎵', url: '🎵', category: 'objects' },
    { id: 'party', name: '🎉', url: '🎉', category: 'objects' }
  ];

  // Sample AI editing options
  const aiEdits = [
    { id: 'enhance', name: 'Mejorar', description: 'Mejora automáticamente la calidad' },
    { id: 'background', name: 'Cambiar Fondo', description: 'Cambia el fondo de la imagen' },
    { id: 'style', name: 'Aplicar Estilo', description: 'Aplica un estilo artístico' },
    { id: 'color', name: 'Ajustar Colores', description: 'Mejora los colores' },
    { id: 'custom', name: 'Personalizado', description: 'Describe lo que quieres hacer' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      
      if (cameras.length > 0) {
        setSelectedCamera(cameras[0].deviceId);
      }
      
      return cameras;
    } catch (error) {
      console.error('Error getting cameras:', error);
      return [];
    }
  };

  const startCamera = useCallback(async () => {
    try {
      setIsCameraLoading(true);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('La cámara no está disponible en este dispositivo.');
        setShowError(true);
        setIsCameraLoading(false);
        return;
      }

      const cameras = await getAvailableCameras();
      let stream: MediaStream;
      
      try {
        if (selectedCamera && cameras.length > 0) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              deviceId: { exact: selectedCamera },
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 }
            },
            audio: mediaType === 'video'
          });
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 }
            },
            audio: mediaType === 'video'
          });
        }
      } catch (firstError) {
        console.log('Selected camera failed, trying any camera:', firstError);
        
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: mediaType === 'video'
          });
        } catch (secondError) {
          console.log('Any camera attempt failed:', secondError);
          
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { min: 320, ideal: 640 },
              height: { min: 240, ideal: 480 }
            },
            audio: mediaType === 'video'
          });
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera stream ready');
          setIsCameraLoading(false);
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
          setErrorMessage('Error al cargar la cámara.');
          setShowError(true);
          setIsCameraLoading(false);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          setIsCameraLoading(false);
        };
        
        videoRef.current.onloadeddata = () => {
          console.log('Video data loaded');
          setIsCameraLoading(false);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraLoading(false);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Permiso de cámara denegado.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No se encontró ninguna cámara.');
        } else if (error.name === 'NotReadableError') {
          setErrorMessage('La cámara está siendo usada por otra aplicación.');
        } else if (error.name === 'OverconstrainedError') {
          setErrorMessage('La cámara no soporta la configuración solicitada.');
        } else {
          setErrorMessage(`Error de cámara: ${error.message}`);
        }
      } else {
        setErrorMessage('No se pudo acceder a la cámara.');
      }
      setShowError(true);
    }
  }, [selectedCamera, mediaType]);

  const captureMedia = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const mediaData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedMedia(mediaData);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Texto aquí',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial'
    };
    setTextOverlays([...textOverlays, newText]);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(textOverlays.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(text => text.id !== id));
  };

  const toggleSticker = (stickerId: string) => {
    setSelectedStickers(prev => 
      prev.includes(stickerId) 
        ? prev.filter(id => id !== stickerId)
        : [...prev, stickerId]
    );
  };

  const processAIEdit = async (aiEdit: any) => {
    if (!capturedMedia) {
      setErrorMessage('Primero debes seleccionar una imagen');
      setShowError(true);
      return;
    }

    if (aiEdit.id === 'custom' && !aiPrompt.trim()) {
      setErrorMessage('Por favor, describe lo que quieres hacer con la imagen');
      setShowError(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('AI Edit:', aiEdit.name, 'Prompt:', aiEdit.prompt || aiPrompt);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          if (aiEdit.id === 'enhance') {
            ctx.filter = 'brightness(1.2) contrast(1.1) saturate(1.3)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'background') {
            ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'style') {
            ctx.filter = 'sepia(0.5) hue-rotate(30deg)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'color') {
            ctx.filter = 'saturate(1.5) brightness(1.1)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'custom') {
            const prompt = aiPrompt.toLowerCase();
            if (prompt.includes('brillante') || prompt.includes('bright')) {
              ctx.filter = 'brightness(1.3) contrast(1.1)';
            } else if (prompt.includes('contraste') || prompt.includes('contrast')) {
              ctx.filter = 'contrast(1.4) brightness(1.05)';
            } else if (prompt.includes('saturado') || prompt.includes('saturate')) {
              ctx.filter = 'saturate(1.6) brightness(1.1)';
            } else if (prompt.includes('vintage') || prompt.includes('retro')) {
              ctx.filter = 'sepia(0.7) hue-rotate(20deg) brightness(1.1)';
            } else if (prompt.includes('blanco') || prompt.includes('negro') || prompt.includes('black')) {
              ctx.filter = 'grayscale(1) contrast(1.2)';
            } else if (prompt.includes('warm') || prompt.includes('cálido')) {
              ctx.filter = 'sepia(0.3) brightness(1.2) saturate(1.3)';
            } else if (prompt.includes('cool') || prompt.includes('frío')) {
              ctx.filter = 'hue-rotate(180deg) saturate(1.2) brightness(0.9)';
            } else {
              ctx.filter = 'brightness(1.1) contrast(1.2) saturate(1.1)';
            }
            ctx.drawImage(img, 0, 0);
          }
          
          const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setProcessedMedia(processedDataUrl);
        }
      };
      
      img.src = capturedMedia;
      
      setShowSuccess(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('AI processing error:', error);
      setErrorMessage('Error al procesar con IA');
      setShowError(true);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (capturedMedia) {
      const mediaToSave = processedMedia || capturedMedia;
      const finalDescription = description || (processedMedia ? 'Media editado con IA en TIPPER' : 'Media editado con TIPPER');
      onSave(mediaToSave, finalDescription, mediaType);
      onClose();
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setCapturedMedia(null);
    setProcessedMedia(null);
    setSelectedFilter('normal');
    setAiPrompt('');
    setTextOverlays([]);
    setSelectedStickers([]);
    setDescription('');
    onClose();
  };

  React.useEffect(() => {
    if (open && activeTab === 0) {
      getAvailableCameras().then(() => {
        startCamera();
      });
    }
  }, [open, activeTab, startCamera]);

  const renderCameraTab = () => (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {!capturedMedia ? (
        <Box>
          {/* Media Type Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tipo de contenido:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant={mediaType === 'photo' ? 'contained' : 'outlined'}
                onClick={() => setMediaType('photo')}
                startIcon={<PhotoCameraIcon />}
              >
                Foto
              </Button>
              <Button
                variant={mediaType === 'video' ? 'contained' : 'outlined'}
                onClick={() => setMediaType('video')}
                startIcon={<VideoCallIcon />}
              >
                Video
              </Button>
            </Box>
          </Box>

          {/* Camera Selection */}
          <Box sx={{ mb: 2, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">
                Seleccionar cámara:
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                  await getAvailableCameras();
                  startCamera();
                }}
                sx={{ fontSize: '0.75rem' }}
              >
                🔄 Refrescar
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              💡 En portátiles, la cámara integrada suele aparecer primero
            </Typography>
            <select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value);
                if (videoRef.current) {
                  const stream = videoRef.current.srcObject as MediaStream;
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                  }
                }
                startCamera();
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              {availableCameras.length > 0 ? (
                availableCameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Cámara ${camera.deviceId.slice(0, 8)}...`}
                  </option>
                ))
              ) : (
                <option value="">Cargando cámaras...</option>
              )}
            </select>
          </Box>
          
          <Box sx={{ position: 'relative', mb: 2 }}>
            {isCameraLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={40} sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                  Iniciando cámara...
                </Typography>
              </Box>
            )}
            
            {(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) && (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 300,
                  backgroundColor: '#000',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <CameraIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Cámara no disponible
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                  Usa "Seleccionar de la biblioteca" para elegir una foto
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => document.getElementById('gallery-input')?.click()}
                  sx={{ 
                    backgroundColor: 'secondary.main',
                    '&:hover': { backgroundColor: 'secondary.dark' }
                  }}
                >
                  📱 Seleccionar foto ahora
                </Button>
              </Box>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '12px',
                filter: selectedFilter !== 'normal' ? filters.find(f => f.id === selectedFilter)?.filter : 'none',
                backgroundColor: '#000',
                display: !navigator.mediaDevices ? 'none' : 'block'
              }}
              onLoadedData={() => {
                console.log('Video loaded successfully');
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setErrorMessage('Error al cargar la cámara');
                setShowError(true);
              }}
            />
            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
              <IconButton
                onClick={captureMedia}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 64,
                  height: 64,
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                {mediaType === 'photo' ? <PhotoCameraIcon /> : <VideoCallIcon />}
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toca el botón para tomar {mediaType === 'photo' ? 'la foto' : 'el video'}
          </Typography>
          
          {/* Gallery Selection Button */}
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
              id="gallery-input"
              style={{ display: 'none' }}
              onChange={(e) => {
                try {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const dataUrl = e.target?.result as string;
                        setCapturedMedia(dataUrl);
                      } catch (error) {
                        console.error('Error reading file:', error);
                        setErrorMessage('Error al leer el archivo. Intenta con otro archivo.');
                        setShowError(true);
                      }
                    };
                    reader.onerror = () => {
                      setErrorMessage('Error al leer el archivo. Intenta con otro archivo.');
                      setShowError(true);
                    };
                    reader.readAsDataURL(file);
                  }
                } catch (error) {
                  console.error('Error selecting file:', error);
                  setErrorMessage('Error al seleccionar el archivo. Intenta de nuevo.');
                  setShowError(true);
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={mediaType === 'photo' ? <PhotoCameraIcon /> : <VideoCallIcon />}
              onClick={() => document.getElementById('gallery-input')?.click()}
              sx={{ 
                mt: 1,
                backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.dark' }
              }}
            >
              📱 Seleccionar de la biblioteca
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
              Si la cámara no funciona, usa esta opción para seleccionar de tu galería
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <img
            src={capturedMedia}
            alt="Captured"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              borderRadius: '12px',
              filter: selectedFilter !== 'normal' ? filters.find(f => f.id === selectedFilter)?.filter : 'none'
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setCapturedMedia(null)}>
              Volver a tomar
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Usar {mediaType === 'photo' ? 'foto' : 'video'}
            </Button>
          </Box>
        </Box>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );

  const renderFiltersTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Aplicar filtros
      </Typography>
      
      <Grid container spacing={2}>
        {filters.map((filter) => (
          <Grid item xs={3} key={filter.id}>
            <Paper
              onClick={() => setSelectedFilter(filter.id)}
              sx={{
                p: 1,
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedFilter === filter.id ? '2px solid' : '1px solid',
                borderColor: selectedFilter === filter.id ? 'primary.main' : 'divider',
                borderRadius: 2
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 60,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
              >
                {filter.name}
              </Box>
              <Typography variant="caption" display="block">
                {filter.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {capturedMedia && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vista previa con filtro aplicado
          </Typography>
          <img
            src={capturedMedia}
            alt="Preview"
            style={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              borderRadius: '8px',
              filter: selectedFilter !== 'normal' ? filters.find(f => f.id === selectedFilter)?.filter : 'none'
            }}
          />
        </Box>
      )}
    </Box>
  );

  const renderStickersTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Agregar stickers
      </Typography>
      
      <Grid container spacing={2}>
        {stickers.map((sticker) => (
          <Grid item xs={3} key={sticker.id}>
            <Paper
              onClick={() => toggleSticker(sticker.id)}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedStickers.includes(sticker.id) ? '2px solid' : '1px solid',
                borderColor: selectedStickers.includes(sticker.id) ? 'primary.main' : 'divider',
                borderRadius: 2,
                fontSize: '2rem'
              }}
            >
              {sticker.url}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {selectedStickers.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Stickers seleccionados:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {selectedStickers.map((stickerId) => {
              const sticker = stickers.find(s => s.id === stickerId);
              return (
                <Chip
                  key={stickerId}
                  label={sticker?.name || stickerId}
                  onDelete={() => toggleSticker(stickerId)}
                  sx={{ fontSize: '1.2rem' }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );

  const renderTextTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Agregar texto
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addTextOverlay}
        sx={{ mb: 3 }}
      >
        Agregar texto
      </Button>
      
      {textOverlays.map((textOverlay) => (
        <Paper key={textOverlay.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2">
              Texto {textOverlays.indexOf(textOverlay) + 1}
            </Typography>
            <IconButton
              size="small"
              onClick={() => removeTextOverlay(textOverlay.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <TextField
            fullWidth
            label="Texto"
            value={textOverlay.text}
            onChange={(e) => updateTextOverlay(textOverlay.id, { text: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tamaño de fuente"
                type="number"
                value={textOverlay.fontSize}
                onChange={(e) => updateTextOverlay(textOverlay.id, { fontSize: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={textOverlay.color}
                onChange={(e) => updateTextOverlay(textOverlay.id, { color: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  const renderAITab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edición con IA
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {aiEdits.map((aiEdit) => (
          <Grid item xs={6} key={aiEdit.id}>
            <Paper
              onClick={() => aiEdit.id === 'custom' ? null : processAIEdit(aiEdit)}
              sx={{
                p: 2,
                cursor: aiEdit.id === 'custom' ? 'default' : 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': aiEdit.id !== 'custom' ? { backgroundColor: 'action.hover' } : {}
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {aiEdit.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {aiEdit.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Edición personalizada
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Palabras clave que funcionan:</strong><br/>
          • "brillante" o "bright" - Hace la imagen más brillante<br/>
          • "contraste" o "contrast" - Aumenta el contraste<br/>
          • "saturado" o "saturate" - Aumenta la saturación<br/>
          • "vintage" o "retro" - Efecto vintage<br/>
          • "blanco y negro" - Convierte a blanco y negro<br/>
          • "warm" o "cálido" - Efecto cálido<br/>
          • "cool" o "frío" - Efecto frío
        </Typography>
      </Alert>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Describe lo que quieres hacer con la imagen"
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => processAIEdit({ id: 'custom', name: 'Personalizado', description: '', prompt: aiPrompt })}
          disabled={!aiPrompt.trim() || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <AIIcon />}
        >
          {isProcessing ? 'Procesando...' : 'Aplicar edición IA'}
        </Button>
        
        {processedMedia && (
          <Button
            variant="outlined"
            onClick={() => setProcessedMedia(null)}
            disabled={isProcessing}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Resetear
          </Button>
        )}
      </Box>
      
      {capturedMedia && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Vista previa
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Original
              </Typography>
              <img
                src={capturedMedia}
                alt="Original"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0'
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                {processedMedia ? 'Procesada' : 'Sin procesar'}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: processedMedia ? 'primary.main' : '#e0e0e0',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {processedMedia ? (
                  <img
                    src={processedMedia}
                    alt="Processed"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.100',
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2">
                      Aplica una edición IA para ver el resultado
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          
          {processedMedia && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                ✅ Imagen procesada con IA lista para usar
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            height: isMobile ? '100vh' : 'auto'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Editor Avanzado TIPPER - {contentType === 'story' ? 'Historia' : 'Post'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<CameraIcon />} 
              label="Cámara" 
              iconPosition="start"
            />
            <Tab 
              icon={<FilterIcon />} 
              label="Filtros" 
              iconPosition="start"
            />
            <Tab 
              icon={<StickerIcon />} 
              label="Stickers" 
              iconPosition="start"
            />
            <Tab 
              icon={<TextIcon />} 
              label="Texto" 
              iconPosition="start"
            />
            <Tab 
              icon={<AIIcon />} 
              label="IA" 
              iconPosition="start"
            />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && renderCameraTab()}
            {activeTab === 1 && renderFiltersTab()}
            {activeTab === 2 && renderStickersTab()}
            {activeTab === 3 && renderTextTab()}
            {activeTab === 4 && renderAITab()}
          </Box>
        </DialogContent>
        
        {capturedMedia && (
          <DialogActions sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe tu ${contentType === 'story' ? 'historia' : 'post'}...`}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Publicar {contentType === 'story' ? 'historia' : 'post'}
              </Button>
            </Box>
          </DialogActions>
        )}
      </Dialog>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          ¡Edición IA aplicada exitosamente!
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdvancedEditor; 