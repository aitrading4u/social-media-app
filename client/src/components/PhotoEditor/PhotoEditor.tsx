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
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Camera as CameraIcon,
  Filter as FilterIcon,
  AutoAwesome as AIIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideocamIcon,
  FlipCameraIos as FlipCameraIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

interface PhotoEditorProps {
  open: boolean;
  onClose: () => void;
  onPhotoTaken: (photoData: string, description: string) => void;
}

interface Filter {
  id: string;
  name: string;
  preview: string;
  filter: string;
}

interface AIEdit {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ open, onClose, onPhotoTaken }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample filters
  const filters: Filter[] = [
    { id: 'normal', name: 'Normal', preview: 'https://via.placeholder.com/80/667eea/ffffff?text=N', filter: 'none' },
    { id: 'vintage', name: 'Vintage', preview: 'https://via.placeholder.com/80/8B4513/ffffff?text=V', filter: 'sepia(0.8) hue-rotate(30deg)' },
    { id: 'blackwhite', name: 'B&W', preview: 'https://via.placeholder.com/80/333333/ffffff?text=B', filter: 'grayscale(1)' },
    { id: 'warm', name: 'Warm', preview: 'https://via.placeholder.com/80/FF6B35/ffffff?text=W', filter: 'sepia(0.3) brightness(1.1)' },
    { id: 'cool', name: 'Cool', preview: 'https://via.placeholder.com/80/4A90E2/ffffff?text=C', filter: 'hue-rotate(180deg) saturate(1.2)' },
    { id: 'dramatic', name: 'Dramatic', preview: 'https://via.placeholder.com/80/2C3E50/ffffff?text=D', filter: 'contrast(1.3) brightness(0.8)' },
    { id: 'bright', name: 'Bright', preview: 'https://via.placeholder.com/80/FFD700/ffffff?text=B', filter: 'brightness(1.3) saturate(1.2)' },
    { id: 'soft', name: 'Soft', preview: 'https://via.placeholder.com/80/F8BBD9/ffffff?text=S', filter: 'blur(0.5px) brightness(1.1)' }
  ];

  // Sample AI editing options
  const aiEdits: AIEdit[] = [
    { id: 'enhance', name: 'Mejorar Foto', description: 'Mejora automáticamente la calidad de la imagen', prompt: 'Enhance this photo to make it look professional and high quality' },
    { id: 'background', name: 'Cambiar Fondo', description: 'Cambia el fondo de la imagen', prompt: 'Change the background to a beautiful landscape' },
    { id: 'style', name: 'Aplicar Estilo', description: 'Aplica un estilo artístico a la imagen', prompt: 'Apply a modern artistic style to this photo' },
    { id: 'object', name: 'Agregar Objeto', description: 'Agrega un objeto específico a la imagen', prompt: 'Add a beautiful flower to this photo' },
    { id: 'color', name: 'Ajustar Colores', description: 'Mejora los colores de la imagen', prompt: 'Enhance the colors to make them more vibrant' },
    { id: 'custom', name: 'Personalizado', description: 'Describe lo que quieres hacer con la imagen', prompt: '' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      
      // Auto-select the first camera (usually the built-in one)
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
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('La cámara no está disponible en este dispositivo. Usa "Seleccionar de la biblioteca" como alternativa.');
        setShowError(true);
        setIsCameraLoading(false);
        return;
      }

      // Get available cameras first
      const cameras = await getAvailableCameras();
      
      // Try different camera configurations
      let stream: MediaStream;
      
      try {
        if (selectedCamera && cameras.length > 0) {
          // Use the selected camera
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              deviceId: { exact: selectedCamera },
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 }
            },
            audio: false
          });
        } else {
          // First try: user camera (front camera) - usually the built-in laptop camera
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 }
            },
            audio: false
          });
        }
      } catch (firstError) {
        console.log('Selected camera failed, trying any camera:', firstError);
        
        try {
          // Second try: any camera with minimal constraints
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false
          });
        } catch (secondError) {
          console.log('Any camera attempt failed:', secondError);
          
          // Third try: environment camera (back camera) - for mobile devices
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { min: 320, ideal: 640 },
              height: { min: 240, ideal: 480 }
            },
            audio: false
          });
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera stream ready');
          setIsCameraLoading(false);
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
          setErrorMessage('Error al cargar la cámara. Usa "Seleccionar de la biblioteca" como alternativa.');
          setShowError(true);
          setIsCameraLoading(false);
        };
        
        // Additional event listeners
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
      
      // More specific error messages
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Permiso de cámara denegado. Ve a Configuración > Privacidad > Cámara y permite el acceso a este sitio web.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No se encontró ninguna cámara en tu dispositivo. Usa "Seleccionar de la biblioteca" como alternativa.');
        } else if (error.name === 'NotReadableError') {
          setErrorMessage('La cámara está siendo usada por otra aplicación. Cierra otras apps que usen la cámara.');
        } else if (error.name === 'OverconstrainedError') {
          setErrorMessage('La cámara no soporta la configuración solicitada. Usa "Seleccionar de la biblioteca" como alternativa.');
        } else {
          setErrorMessage(`Error de cámara: ${error.message}. Usa "Seleccionar de la biblioteca" como alternativa.`);
        }
      } else {
        setErrorMessage('No se pudo acceder a la cámara. Usa "Seleccionar de la biblioteca" como alternativa.');
      }
      setShowError(true);
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const applyFilter = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const processAIEdit = async (aiEdit: AIEdit) => {
    if (!capturedImage) {
      setErrorMessage('Primero debes seleccionar una imagen');
      setShowError(true);
      return;
    }

    // For custom edits, require a prompt
    if (aiEdit.id === 'custom' && !aiPrompt.trim()) {
      setErrorMessage('Por favor, describe lo que quieres hacer con la imagen');
      setShowError(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would send the image and prompt to an AI service
      console.log('AI Edit:', aiEdit.name, 'Prompt:', aiEdit.prompt || aiPrompt);
      
      // Simulate processed image by applying some visual effects
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Apply different effects based on AI edit type
          ctx.drawImage(img, 0, 0);
          
          if (aiEdit.id === 'enhance') {
            // Simulate enhancement
            ctx.filter = 'brightness(1.2) contrast(1.1) saturate(1.3)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'background') {
            // Simulate background change
            ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'style') {
            // Simulate artistic style
            ctx.filter = 'sepia(0.5) hue-rotate(30deg)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'color') {
            // Simulate color enhancement
            ctx.filter = 'saturate(1.5) brightness(1.1)';
            ctx.drawImage(img, 0, 0);
          } else if (aiEdit.id === 'custom') {
            // Simulate custom edit based on prompt
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
              // Default custom effect
              ctx.filter = 'brightness(1.1) contrast(1.2) saturate(1.1)';
            }
            ctx.drawImage(img, 0, 0);
          }
          
          const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setProcessedImage(processedDataUrl);
        }
      };
      
      img.src = capturedImage;
      
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
    if (capturedImage) {
      // Use processed image if available, otherwise use original
      const imageToSave = processedImage || capturedImage;
      const description = aiPrompt || (processedImage ? 'Foto editada con IA en TIPPER' : 'Foto editada con TIPPER');
      onPhotoTaken(imageToSave, description);
      onClose();
    }
  };

  const handleClose = () => {
    // Stop camera stream if active
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setCapturedImage(null);
    setProcessedImage(null);
    setSelectedFilter('normal');
    setAiPrompt('');
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
      {!capturedImage ? (
        <Box>
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
              💡 En portátiles, la cámara integrada suele aparecer primero en la lista
            </Typography>
            <select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value);
                // Restart camera with new selection
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
             
                           {/* Camera not available message */}
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
                 backgroundColor: '#000', // Black background while loading
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
                onClick={capturePhoto}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 64,
                  height: 64,
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
          </Box>
          
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             Toca el botón para tomar la foto
           </Typography>
           
           {/* Gallery Selection Button */}
           <Box sx={{ mt: 2 }}>
             <input
               type="file"
               accept="image/*"
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
                         setCapturedImage(dataUrl);
                       } catch (error) {
                         console.error('Error reading file:', error);
                         setErrorMessage('Error al leer el archivo. Intenta con otra imagen.');
                         setShowError(true);
                       }
                     };
                     reader.onerror = () => {
                       setErrorMessage('Error al leer el archivo. Intenta con otra imagen.');
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
               startIcon={<PhotoCameraIcon />}
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
               Si la cámara no funciona, usa esta opción para seleccionar una foto de tu galería
             </Typography>
           </Box>
        </Box>
      ) : (
        <Box>
          <img
            src={capturedImage}
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
            <Button variant="outlined" onClick={() => setCapturedImage(null)}>
              Volver a tomar
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Usar foto
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
              onClick={() => applyFilter(filter.id)}
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
                  backgroundImage: `url(${filter.preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mb: 1
                }}
              />
              <Typography variant="caption" display="block">
                {filter.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {capturedImage && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vista previa con filtro aplicado
          </Typography>
          <img
            src={capturedImage}
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
         placeholder="Describe lo que quieres hacer con la imagen (ej: hacer la imagen más brillante, cambiar el fondo, etc.)"
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
         
         {processedImage && (
           <Button
             variant="outlined"
             onClick={() => setProcessedImage(null)}
             disabled={isProcessing}
             sx={{ minWidth: 'auto', px: 2 }}
           >
             Resetear
           </Button>
         )}
       </Box>
      
             {capturedImage && (
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
                 src={capturedImage}
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
                 {processedImage ? 'Procesada' : 'Sin procesar'}
               </Typography>
               <Box
                 sx={{
                   width: '100%',
                   height: 'auto',
                   borderRadius: '8px',
                   border: '2px solid',
                   borderColor: processedImage ? 'primary.main' : '#e0e0e0',
                   overflow: 'hidden',
                   position: 'relative'
                 }}
               >
                 {processedImage ? (
                   <img
                     src={processedImage}
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
           
           {processedImage && (
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
              Editor de Fotos TIPPER
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
            variant="fullWidth"
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
              icon={<AIIcon />} 
              label="IA" 
              iconPosition="start"
            />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && renderCameraTab()}
            {activeTab === 1 && renderFiltersTab()}
            {activeTab === 2 && renderAITab()}
          </Box>
        </DialogContent>
        
        {capturedImage && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Usar foto
            </Button>
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

export default PhotoEditor; 