import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Chip,
  Slider,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Camera as CameraIcon,
  Filter as FilterIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideoCallIcon,
  TextFields as TextIcon,
  EmojiEmotions as StickerIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Brightness4 as BrightnessIcon,
  Contrast as ContrastIcon,
  Palette as PaletteIcon,
  Crop as CropIcon,
  RotateLeft as RotateLeftIcon,
  Flip as FlipIcon,
  PhotoLibrary as GalleryIcon,
  Settings as SettingsIcon,
  FormatColorFill as ColorIcon,
  TextFields as FontIcon,
  AutoAwesome as AIIcon,
  Brush as BrushIcon,
  Straighten as StraightenIcon,
  Tune as TuneIcon,
  Looks as LooksIcon,
  Colorize as ColorizeIcon,
  BlurOn as BlurIcon,
  CenterFocusStrong as FocusIcon,
  Exposure as ExposureIcon,
  WbSunny as WarmthIcon,
  Grain as GrainIcon,
  Vignette as VignetteIcon,
  Highlight as HighlightIcon,
  Brightness2 as ShadowIcon,
  Opacity as OpacityIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface InstagramStyleEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (mediaData: string, description: string, type: 'photo' | 'video') => void;
  contentType: 'post' | 'story';
}

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  isSelected: boolean;
  isEditing: boolean;
  isDragging: boolean;
  isResizing: boolean;
  alignment: 'left' | 'center' | 'right';
  style: 'normal' | 'bold' | 'italic';
  rotation: number;
}

interface Filter {
  id: string;
  name: string;
  filter: string;
  preview: string;
  intensity: number;
}

const InstagramStyleEditor: React.FC<InstagramStyleEditorProps> = ({ 
  open, 
  onClose, 
  onSave, 
  contentType 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Enhanced mobile detection
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
    return isMobile && !isTablet;
  };

  const getMobileBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);
    const isEdge = /edge/i.test(userAgent);
    const isOpera = /opera|opr/i.test(userAgent);
    
    // Extract version numbers
    const chromeMatch = userAgent.match(/chrome\/(\d+)/i);
    const safariMatch = userAgent.match(/version\/(\d+)/i);
    const firefoxMatch = userAgent.match(/firefox\/(\d+)/i);
    
    return {
      isIOS,
      isAndroid,
      isChrome,
      isSafari,
      isFirefox,
      isEdge,
      isOpera,
      chromeVersion: chromeMatch ? parseInt(chromeMatch[1]) : null,
      safariVersion: safariMatch ? parseInt(safariMatch[1]) : null,
      firefoxVersion: firefoxMatch ? parseInt(firefoxMatch[1]) : null,
      userAgent
    };
  };

  // Diagnostic function to help debug camera issues
  const logCameraDiagnostics = () => {
    console.log('=== Camera Diagnostics ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile:', isMobileDevice());
    console.log('Is Secure Context:', window.isSecureContext);
    console.log('MediaDevices available:', !!navigator.mediaDevices);
    console.log('getUserMedia available:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    console.log('enumerateDevices available:', !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices));
    
    // Check for specific browser features
    const userAgent = navigator.userAgent.toLowerCase();
    console.log('Browser detection:', {
      isChrome: /chrome/.test(userAgent),
      isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
      isFirefox: /firefox/.test(userAgent),
      isEdge: /edge/.test(userAgent),
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent)
    });
    
    // Try to enumerate devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          console.log('Available devices:', devices);
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          console.log('Video devices:', videoDevices);
        })
        .catch(error => {
          console.log('Error enumerating devices:', error);
        });
    }
  };
  
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [activeTab, setActiveTab] = useState(0);
  const [isInEditor, setIsInEditor] = useState(false);
  
  // Instagram-style adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [temperature, setTemperature] = useState(0);
  const [tint, setTint] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [shadows, setShadows] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [grain, setGrain] = useState(0);
  const [fade, setFade] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [blur, setBlur] = useState(0);
  
  // Transform controls
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // Stickers and text
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [description, setDescription] = useState('');
  
  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState<number>(1);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, elementId: string, elementType: 'sticker' | 'text') => {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setTouchStart({ x, y });
    setSelectedElement(elementId);
    
    if (elementType === 'sticker') {
      setStickers(stickers.map(sticker => 
        sticker.id === elementId 
          ? { ...sticker, isSelected: true, isDragging: true }
          : { ...sticker, isSelected: false, isDragging: false }
      ));
    } else {
      setTextOverlays(textOverlays.map(text => 
        text.id === elementId 
          ? { ...text, isSelected: true, isDragging: true }
          : { ...text, isSelected: false, isDragging: false }
      ));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string, elementType: 'sticker' | 'text') => {
    e.preventDefault(); // Prevent default mouse behavior
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTouchStart({ x, y });
    setSelectedElement(elementId);
    
    if (elementType === 'sticker') {
      setStickers(stickers.map(sticker => 
        sticker.id === elementId 
          ? { ...sticker, isSelected: true, isDragging: true }
          : { ...sticker, isSelected: false, isDragging: false }
      ));
    } else {
      setTextOverlays(textOverlays.map(text => 
        text.id === elementId 
          ? { ...text, isSelected: true, isDragging: true }
          : { ...text, isSelected: false, isDragging: false }
      ));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    if (!touchStart || !selectedElement) return;
    
    const touch = e.touches[0];
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const deltaX = touch.clientX - rect.left - touchStart.x;
    const deltaY = touch.clientY - rect.top - touchStart.y;
    
    // Update sticker position
    setStickers(stickers.map(sticker => 
      sticker.id === selectedElement && sticker.isDragging
        ? { ...sticker, x: Math.max(0, Math.min(rect.width - 50, sticker.x + deltaX)), y: Math.max(0, Math.min(rect.height - 50, sticker.y + deltaY)) }
        : sticker
    ));
    
    // Update text position
    setTextOverlays(textOverlays.map(text => 
      text.id === selectedElement && text.isDragging
        ? { ...text, x: Math.max(0, Math.min(rect.width - 100, text.x + deltaX)), y: Math.max(0, Math.min(rect.height - 50, text.y + deltaY)) }
        : text
    ));
    
    setTouchStart({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    if (!touchStart || !selectedElement) return;
    
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const deltaX = e.clientX - rect.left - touchStart.x;
    const deltaY = e.clientY - rect.top - touchStart.y;
    
    // Update sticker position
    setStickers(stickers.map(sticker => 
      sticker.id === selectedElement && sticker.isDragging
        ? { ...sticker, x: Math.max(0, Math.min(rect.width - 50, sticker.x + deltaX)), y: Math.max(0, Math.min(rect.height - 50, sticker.y + deltaY)) }
        : sticker
    ));
    
    // Update text position
    setTextOverlays(textOverlays.map(text => 
      text.id === selectedElement && text.isDragging
        ? { ...text, x: Math.max(0, Math.min(rect.width - 100, text.x + deltaX)), y: Math.max(0, Math.min(rect.height - 50, text.y + deltaY)) }
        : text
    ));
    
    setTouchStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    setTouchStart(null);
    setSelectedElement(null);
    setInitialPinchDistance(null); // Reset pinch distance
    setInitialScale(1); // Reset initial scale
    
    setStickers(stickers.map(sticker => ({ ...sticker, isDragging: false, isResizing: false })));
    setTextOverlays(textOverlays.map(text => ({ ...text, isDragging: false, isResizing: false })));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    setTouchStart(null);
    setSelectedElement(null);
    setInitialPinchDistance(null); // Reset pinch distance
    setInitialScale(1); // Reset initial scale
    
    setStickers(stickers.map(sticker => ({ ...sticker, isDragging: false, isResizing: false })));
    setTextOverlays(textOverlays.map(text => ({ ...text, isDragging: false, isResizing: false })));
  };

  const handlePinchResize = (e: React.TouchEvent, elementId: string, elementType: 'sticker' | 'text') => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event propagation
    
    if (e.touches.length !== 2) return; // Need exactly 2 touches for pinch
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    // Calculate distance between touches
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    // Set initial distance and scale on first pinch
    if (initialPinchDistance === null) {
      setInitialPinchDistance(distance);
      if (elementType === 'sticker') {
        const sticker = stickers.find(s => s.id === elementId);
        setInitialScale(sticker?.scale || 1);
      } else {
        const text = textOverlays.find(t => t.id === elementId);
        setInitialScale((text?.fontSize || 24) / 24);
      }
      return;
    }
    
    // Calculate scale based on initial distance
    const scaleFactor = distance / initialPinchDistance;
    const newScale = Math.max(0.3, Math.min(3, initialScale * scaleFactor));
    
    if (elementType === 'sticker') {
      setStickers(stickers.map(sticker => 
        sticker.id === elementId 
          ? { ...sticker, scale: newScale, isResizing: true }
          : sticker
      ));
    } else {
      setTextOverlays(textOverlays.map(text => 
        text.id === elementId 
          ? { ...text, fontSize: Math.max(12, Math.min(72, newScale * 24)), isResizing: true }
          : text
      ));
    }
  };

  const handleResize = (e: React.TouchEvent, elementId: string, elementType: 'sticker' | 'text') => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event propagation
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(touch.clientX - rect.left, 2) + 
      Math.pow(touch.clientY - rect.top, 2)
    );
    
    const scale = Math.max(0.5, Math.min(3, distance / 50));
    
    if (elementType === 'sticker') {
      setStickers(stickers.map(sticker => 
        sticker.id === elementId 
          ? { ...sticker, scale, isResizing: true }
          : sticker
      ));
    } else {
      setTextOverlays(textOverlays.map(text => 
        text.id === elementId 
          ? { ...text, fontSize: Math.max(12, Math.min(72, scale * 24)), isResizing: true }
          : text
      ));
    }
  };

  const handleMouseResize = (e: React.MouseEvent, elementId: string, elementType: 'sticker' | 'text') => {
    e.preventDefault(); // Prevent default mouse behavior
    e.stopPropagation(); // Stop event propagation
    
    const rect = e.currentTarget.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(e.clientX - rect.left, 2) + 
      Math.pow(e.clientY - rect.top, 2)
    );
    
    const scale = Math.max(0.5, Math.min(3, distance / 50));
    
    if (elementType === 'sticker') {
      setStickers(stickers.map(sticker => 
        sticker.id === elementId 
          ? { ...sticker, scale, isResizing: true }
          : sticker
      ));
    } else {
      setTextOverlays(textOverlays.map(text => 
        text.id === elementId 
          ? { ...text, fontSize: Math.max(12, Math.min(72, scale * 24)), isResizing: true }
          : text
      ));
    }
  };

  // Instagram-style filters with intensity
  const filters: Filter[] = [
    { id: 'normal', name: 'Normal', filter: 'none', preview: 'Normal', intensity: 100 },
    { id: 'clarendon', name: 'Clarendon', filter: 'contrast(1.2) saturate(1.35)', preview: 'Clarendon', intensity: 100 },
    { id: 'gingham', name: 'Gingham', filter: 'brightness(1.05) hue-rotate(-10deg)', preview: 'Gingham', intensity: 100 },
    { id: 'moon', name: 'Moon', filter: 'grayscale(1) contrast(1.1) brightness(1.1)', preview: 'Moon', intensity: 100 },
    { id: 'lark', name: 'Lark', filter: 'brightness(1.1) contrast(1.1) saturate(1.1)', preview: 'Lark', intensity: 100 },
    { id: 'reyes', name: 'Reyes', filter: 'sepia(0.22) brightness(1.1) contrast(1.1)', preview: 'Reyes', intensity: 100 },
    { id: 'juno', name: 'Juno', filter: 'sepia(0.35) contrast(1.15) brightness(1.15)', preview: 'Juno', intensity: 100 },
    { id: 'slumber', name: 'Slumber', filter: 'brightness(1.05) saturate(0.66) hue-rotate(-5deg)', preview: 'Slumber', intensity: 100 },
    { id: 'crema', name: 'Crema', filter: 'sepia(0.5) hue-rotate(-15deg) saturate(1.25)', preview: 'Crema', intensity: 100 },
    { id: 'ludwig', name: 'Ludwig', filter: 'brightness(1.05) contrast(1.05) saturate(1.2)', preview: 'Ludwig', intensity: 100 },
    { id: 'aden', name: 'Aden', filter: 'hue-rotate(-20deg) contrast(1.15) saturate(1.2)', preview: 'Aden', intensity: 100 },
    { id: 'perpetua', name: 'Perpetua', filter: 'contrast(1.1) brightness(1.1)', preview: 'Perpetua', intensity: 100 }
  ];

  // Stickers/Emojis organized by categories
  const stickerCategories = {
    'Emojis': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    'Stars': ['⭐', '🌟', '✨', '⚡', '💫', '💥', '🔥', '💢', '💦', '💨', '💤', '💧', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐'],
    'Nature': ['🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼'],
    'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒']
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const startCamera = useCallback(async () => {
    try {
      setIsCameraLoading(true);
      setShowError(false);
      
      // Get browser info once at the start
      const browserInfo = getMobileBrowserInfo();
      const isMobile = isMobileDevice();
      
      // Run detailed diagnostics
      console.log('=== Detailed Camera Diagnostics ===');
      console.log('Browser Info:', browserInfo);
      console.log('MediaDevices available:', !!navigator.mediaDevices);
      console.log('getUserMedia available:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
      console.log('enumerateDevices available:', !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices));
      console.log('Is Secure Context:', window.isSecureContext);
      console.log('Is Mobile Device:', isMobile);
      console.log('User Agent:', navigator.userAgent);
      
      // Enhanced browser support detection
      if (!navigator.mediaDevices) {
        console.log('Browser info:', browserInfo);
        
        let errorMsg = 'Tu navegador no soporta acceso a dispositivos multimedia. ';
        
        if (browserInfo.isIOS) {
          if (browserInfo.isSafari) {
            errorMsg += 'En iOS, asegúrate de usar Safari actualizado (versión 11+) y haber dado permisos de cámara.';
          } else {
            errorMsg += 'En iOS, usa Safari para acceder a la cámara. Otros navegadores tienen soporte limitado.';
          }
        } else if (browserInfo.isAndroid) {
          if (browserInfo.isChrome && browserInfo.chromeVersion && browserInfo.chromeVersion < 53) {
            errorMsg += 'Tu versión de Chrome es muy antigua. Actualiza Chrome a la versión 53 o superior.';
          } else if (!browserInfo.isChrome) {
            errorMsg += 'En Android, usa Chrome para mejor compatibilidad con la cámara.';
          } else {
            errorMsg += 'Asegúrate de haber dado permisos de cámara en la configuración del navegador.';
          }
        } else {
          errorMsg += 'Intenta usar Chrome, Safari o Firefox actualizado.';
        }
        
        setErrorMessage(errorMsg);
        setShowError(true);
        setIsCameraLoading(false);
        return;
      }

      if (!navigator.mediaDevices.getUserMedia) {
        let errorMsg = 'Tu navegador no soporta getUserMedia. ';
        
        if (browserInfo.isIOS && browserInfo.isSafari && browserInfo.safariVersion && browserInfo.safariVersion < 11) {
          errorMsg += 'Actualiza Safari a la versión 11 o superior.';
        } else if (browserInfo.isAndroid && browserInfo.isChrome && browserInfo.chromeVersion && browserInfo.chromeVersion < 53) {
          errorMsg += 'Actualiza Chrome a la versión 53 o superior.';
        } else {
          errorMsg += 'Intenta usar Chrome, Safari o Firefox actualizado.';
        }
        
        setErrorMessage(errorMsg);
        setShowError(true);
        setIsCameraLoading(false);
        return;
      }

      // Secure context check
      if (!window.isSecureContext) {
        setErrorMessage('Se requiere una conexión segura (HTTPS) para acceder a la cámara. En desarrollo local, usa http://localhost:3000');
        setShowError(true);
        setIsCameraLoading(false);
        return;
      }

      // Enhanced mobile browser checks
      console.log('Enhanced device detection:', { 
        isMobile, 
        browserInfo,
        mediaDevicesAvailable: !!navigator.mediaDevices,
        getUserMediaAvailable: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        isSecureContext: window.isSecureContext
      });
      
      if (isMobile) {
        if (browserInfo.isIOS && !browserInfo.isSafari) {
          setErrorMessage('En iOS, usa Safari para acceder a la cámara. Otros navegadores no tienen soporte completo.');
          setShowError(true);
          setIsCameraLoading(false);
          return;
        }
        if (browserInfo.isAndroid && !browserInfo.isChrome) {
          setErrorMessage('En Android, usa Chrome para mejor compatibilidad con la cámara.');
          setShowError(true);
          setIsCameraLoading(false);
          return;
        }
        if (browserInfo.isIOS && browserInfo.isSafari && browserInfo.safariVersion && browserInfo.safariVersion < 11) {
          setErrorMessage('Tu versión de Safari es muy antigua. Actualiza Safari a la versión 11 o superior.');
          setShowError(true);
          setIsCameraLoading(false);
          return;
        }
        if (browserInfo.isAndroid && browserInfo.isChrome && browserInfo.chromeVersion && browserInfo.chromeVersion < 53) {
          setErrorMessage('Tu versión de Chrome es muy antigua. Actualiza Chrome a la versión 53 o superior.');
          setShowError(true);
          setIsCameraLoading(false);
          return;
        }
      }
      
      // Enhanced camera configurations for better mobile compatibility
      const cameraConfigs = [
        // Mobile-optimized configurations
        { 
          video: { 
            facingMode: 'user',
            width: isMobile ? { min: 320, ideal: 480, max: 720 } : { min: 320, ideal: 640, max: 1280 },
            height: isMobile ? { min: 240, ideal: 360, max: 540 } : { min: 240, ideal: 480, max: 720 },
            frameRate: { ideal: isMobile ? 24 : 30 }
          }, 
          audio: mediaType === 'video' 
        },
        { 
          video: { 
            facingMode: 'environment',
            width: isMobile ? { min: 320, ideal: 480, max: 720 } : { min: 320, ideal: 640, max: 1280 },
            height: isMobile ? { min: 240, ideal: 360, max: 540 } : { min: 240, ideal: 480, max: 720 },
            frameRate: { ideal: isMobile ? 24 : 30 }
          }, 
          audio: mediaType === 'video' 
        },
        // Try with deviceId if available
        async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('Available video devices:', videoDevices);
            if (videoDevices.length > 0) {
              return {
                video: { 
                  deviceId: { exact: videoDevices[0].deviceId },
                  width: isMobile ? { min: 320, ideal: 480, max: 720 } : { min: 320, ideal: 640, max: 1280 },
                  height: isMobile ? { min: 240, ideal: 360, max: 540 } : { min: 240, ideal: 480, max: 720 }
                }, 
                audio: mediaType === 'video' 
              };
            }
          } catch (e) {
            console.log('Could not enumerate devices:', e);
          }
          return null;
        },
        // Mobile-specific: try back camera first on mobile
        ...(isMobile ? [{
          video: { 
            facingMode: 'environment',
            width: { min: 320, ideal: 480, max: 720 },
            height: { min: 240, ideal: 360, max: 540 },
            frameRate: { ideal: 24 }
          }, 
          audio: mediaType === 'video' 
        }] : []),
        // Simplified configurations
        { 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: mediaType === 'video' 
        },
        { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: mediaType === 'video' 
        },
        // Minimal constraints
        { 
          video: { 
            facingMode: 'user'
          }, 
          audio: mediaType === 'video' 
        },
        { 
          video: { 
            facingMode: 'environment'
          }, 
          audio: mediaType === 'video' 
        },
        // Fallback to any camera
        { 
          video: true, 
          audio: mediaType === 'video' 
        }
      ];

      let stream: MediaStream | undefined;
      let lastError: any;
      
      for (let i = 0; i < cameraConfigs.length; i++) {
        const config = cameraConfigs[i];
        try {
          let actualConfig;
          
          // Handle async config functions
          if (typeof config === 'function') {
            actualConfig = await config();
            if (!actualConfig) continue;
          } else {
            actualConfig = config;
          }
          
          console.log(`Trying camera config ${i + 1}:`, actualConfig);
          stream = await navigator.mediaDevices.getUserMedia(actualConfig);
          console.log('Camera started successfully with config:', actualConfig);
          break;
        } catch (error) {
          console.log(`Camera config ${i + 1} failed:`, config, error);
          lastError = error;
          continue;
        }
      }
      
      if (!stream) {
        throw lastError;
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
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraLoading(false);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Permiso de cámara denegado. Por favor, permite el acceso a la cámara y recarga la página.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No se encontró ninguna cámara en este dispositivo.');
        } else if (error.name === 'NotSupportedError') {
          setErrorMessage('Este navegador no soporta acceso a la cámara. Intenta usar Chrome, Safari o Firefox actualizado.');
        } else if (error.name === 'NotReadableError') {
          setErrorMessage('La cámara está siendo usada por otra aplicación. Cierra otras apps que usen la cámara.');
        } else if (error.name === 'OverconstrainedError') {
          setErrorMessage('La cámara no puede cumplir con los requisitos solicitados. Intenta con otra configuración.');
        } else {
          setErrorMessage(`Error de cámara: ${error.message}`);
        }
      } else {
        setErrorMessage('No se pudo acceder a la cámara. Usa "Seleccionar de la biblioteca" como alternativa.');
      }
      setShowError(true);
    }
  }, [mediaType]);

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
        setIsInEditor(true);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const dataUrl = e.target?.result as string;
            setCapturedMedia(dataUrl);
            setIsInEditor(true);
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
  };

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji,
      x: 100,
      y: 100,
      scale: 1,
      rotation: 0,
      isSelected: false,
      isDragging: false,
      isResizing: false
    };
    setStickers([...stickers, newSticker]);
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Toca para editar',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      isSelected: false,
      isEditing: false,
      isDragging: false,
      isResizing: false,
      alignment: 'center',
      style: 'normal',
      rotation: 0
    };
    setTextOverlays([...textOverlays, newText]);
  };

  const handleSave = () => {
    if (capturedMedia) {
      // Render final image with all overlays and adjustments
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Apply transformations
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scale, scale);
          if (flipHorizontal) ctx.scale(-1, 1);
          if (flipVertical) ctx.scale(1, -1);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();
          
          // Apply filter and adjustments
          const filter = filters.find(f => f.id === selectedFilter);
          if (filter && filter.id !== 'normal') {
            ctx.filter = filter.filter;
            ctx.drawImage(canvas, 0, 0);
            ctx.filter = 'none';
          }
          
          // Apply adjustments
          ctx.filter = `
            brightness(${brightness}%) 
            contrast(${contrast}%) 
            saturate(${saturation}%) 
            hue-rotate(${temperature}deg)
            sepia(${tint}%)
          `;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
          
          // Draw stickers
          stickers.forEach(sticker => {
            ctx.save();
            ctx.translate(sticker.x + 20, sticker.y + 20);
            ctx.rotate((sticker.rotation * Math.PI) / 180);
            ctx.scale(sticker.scale, sticker.scale);
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(sticker.emoji, 0, 0);
            ctx.restore();
          });
          
          // Draw text overlays
          textOverlays.forEach(text => {
            ctx.save();
            ctx.font = `${text.style === 'bold' ? 'bold' : ''} ${text.style === 'italic' ? 'italic' : ''} ${text.fontSize}px ${text.fontFamily}`;
            ctx.fillStyle = text.color;
            ctx.textAlign = text.alignment;
            ctx.textBaseline = 'top';
            ctx.fillText(text.text, text.x, text.y);
            ctx.restore();
          });
          
          const finalImageData = canvas.toDataURL('image/jpeg', 0.9);
          const finalDescription = description || 'Media editado con TIPPER';
          onSave(finalImageData, finalDescription, mediaType);
          onClose();
        }
      };
      
      img.src = capturedMedia;
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
    setSelectedFilter('normal');
    setActiveTab(0);
    setIsInEditor(false);
    // Reset all adjustments
    setBrightness(100); setContrast(100); setSaturation(100); setTemperature(0);
    setTint(0); setHighlights(0); setShadows(0); setVignette(0);
    setGrain(0); setFade(0); setClarity(0); setSharpness(0); setBlur(0);
    setRotation(0); setScale(1); setFlipHorizontal(false); setFlipVertical(false);
    setStickers([]); setTextOverlays([]); setDescription('');
    onClose();
  };

  const goBackToCamera = () => {
    setIsInEditor(false);
    setCapturedMedia(null);
    setSelectedFilter('normal');
    setActiveTab(0);
    // Reset all adjustments
    setBrightness(100); setContrast(100); setSaturation(100); setTemperature(0);
    setTint(0); setHighlights(0); setShadows(0); setVignette(0);
    setGrain(0); setFade(0); setClarity(0); setSharpness(0); setBlur(0);
    setRotation(0); setScale(1); setFlipHorizontal(false); setFlipVertical(false);
    setStickers([]); setTextOverlays([]); setDescription('');
  };

  useEffect(() => {
    if (open && !capturedMedia && !isInEditor) {
      startCamera();
    }
  }, [open, startCamera, capturedMedia, isInEditor]);

  const renderCameraView = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
      {/* Instagram-style Header */}
      <AppBar position="static" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {contentType === 'story' ? 'Nueva Historia' : 'Nuevo Post'}
          </Typography>
          <Box sx={{ width: 24 }} /> {/* Spacer for centering */}
        </Toolbar>
      </AppBar>

      {/* Camera View */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isCameraLoading && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000'
          }}
        />
        
        {/* Instagram-style Camera Controls */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="text"
              onClick={() => document.getElementById('gallery-input')?.click()}
              sx={{ color: 'white', textTransform: 'none' }}
            >
              📱 Galería
            </Button>
            
            {/* Capture Button */}
            <IconButton
              onClick={captureMedia}
              sx={{
                backgroundColor: 'white',
                color: '#000',
                width: 72,
                height: 72,
                border: '4px solid #fff',
                '&:hover': { backgroundColor: 'white' }
              }}
            >
              {mediaType === 'photo' ? <PhotoCameraIcon sx={{ fontSize: 32 }} /> : <VideoCallIcon sx={{ fontSize: 32 }} />}
            </IconButton>
            
            <Box sx={{ width: 80 }} /> {/* Spacer */}
          </Box>
          
          {/* Media Type Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2, 
              p: 0.5 
            }}>
              <Button
                variant={mediaType === 'photo' ? 'contained' : 'text'}
                onClick={() => setMediaType('photo')}
                sx={{ 
                  color: mediaType === 'photo' ? '#000' : 'white',
                  backgroundColor: mediaType === 'photo' ? 'white' : 'transparent',
                  borderRadius: 1,
                  textTransform: 'none',
                  minWidth: 60
                }}
              >
                Foto
              </Button>
              <Button
                variant={mediaType === 'video' ? 'contained' : 'text'}
                onClick={() => setMediaType('video')}
                sx={{ 
                  color: mediaType === 'video' ? '#000' : 'white',
                  backgroundColor: mediaType === 'video' ? 'white' : 'transparent',
                  borderRadius: 1,
                  textTransform: 'none',
                  minWidth: 60
                }}
              >
                Video
              </Button>
            </Box>
          </Box>
        </Box>
        
        <input
          type="file"
          accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
          id="gallery-input"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>
    </Box>
  );

  const renderEditorView = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
      {/* Instagram-style Header */}
      <AppBar position="static" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
          <IconButton onClick={goBackToCamera} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Editar
          </Typography>
          <Button
            onClick={handleSave}
            sx={{ 
              color: '#0095f6', 
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Siguiente
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Editor Area */}
      <Box sx={{ flex: 1, position: 'relative', p: 2 }}>
        <Box
          ref={editorRef}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '400px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'default',
            touchAction: 'none', // Prevent screen zoom
            userSelect: 'none', // Prevent text selection
            WebkitUserSelect: 'none', // For Safari
            MozUserSelect: 'none', // For Firefox
            msUserSelect: 'none' // For IE/Edge
          }}
          onTouchStart={(e) => e.preventDefault()} // Prevent default touch behavior
          onTouchMove={(e) => e.preventDefault()} // Prevent default touch behavior
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            src={capturedMedia || ''}
            alt="Editor"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `rotate(${rotation}deg) scale(${scale}) ${flipHorizontal ? 'scaleX(-1)' : ''} ${flipVertical ? 'scaleY(-1)' : ''}`,
              filter: `
                ${filters.find(f => f.id === selectedFilter)?.filter || 'none'}
                brightness(${brightness}%) 
                contrast(${contrast}%) 
                saturate(${saturation}%) 
                hue-rotate(${temperature}deg)
                sepia(${tint}%)
              `
            }}
          />
          
          {/* Stickers */}
          {stickers.map((sticker) => (
            <Box
              key={sticker.id}
              sx={{
                position: 'absolute',
                left: sticker.x,
                top: sticker.y,
                cursor: 'grab',
                userSelect: 'none',
                transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                border: sticker.isSelected ? '2px solid #0095f6' : '2px solid transparent',
                borderRadius: '4px',
                padding: '2px',
                touchAction: 'none',
                zIndex: sticker.isSelected ? 1000 : 1
              }}
              onTouchStart={(e) => handleTouchStart(e, sticker.id, 'sticker')}
              onTouchMove={(e) => {
                if (e.touches.length === 2) {
                  handlePinchResize(e, sticker.id, 'sticker');
                } else {
                  handleTouchMove(e);
                }
              }}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={(e) => handleMouseDown(e, sticker.id, 'sticker')}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={(e) => {
                if (sticker.isSelected) {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -15 : 15;
                  setStickers(stickers.map(s => 
                    s.id === sticker.id 
                      ? { ...s, rotation: s.rotation + delta }
                      : s
                  ));
                }
              }}
            >
              <Typography sx={{ fontSize: '2rem' }}>
                {sticker.emoji}
              </Typography>
              {sticker.isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 20,
                    height: 20,
                    backgroundColor: '#0095f6',
                    borderRadius: '50%',
                    cursor: 'nw-resize',
                    border: '2px solid white',
                    zIndex: 1001
                  }}
                  onTouchStart={(e) => handleResize(e, sticker.id, 'sticker')}
                  onTouchMove={(e) => handleResize(e, sticker.id, 'sticker')}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setStickers(stickers.map(s => ({ ...s, isResizing: false })));
                  }}
                                  onMouseDown={(e) => handleMouseResize(e, sticker.id, 'sticker')}
                onMouseMove={(e) => handleMouseResize(e, sticker.id, 'sticker')}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    setStickers(stickers.map(s => ({ ...s, isResizing: false })));
                  }}
                />
              )}
            </Box>
          ))}
          
          {/* Text Overlays */}
          {textOverlays.map((text) => (
            <Box
              key={text.id}
              sx={{
                position: 'absolute',
                left: text.x,
                top: text.y,
                cursor: 'grab',
                userSelect: 'none',
                border: text.isSelected ? '2px solid #0095f6' : '2px solid transparent',
                borderRadius: '4px',
                padding: '2px',
                touchAction: 'none',
                zIndex: text.isSelected ? 1000 : 1,
                transform: `rotate(${text.rotation || 0}deg)`
              }}
              onTouchStart={(e) => handleTouchStart(e, text.id, 'text')}
              onTouchMove={(e) => {
                if (e.touches.length === 2) {
                  handlePinchResize(e, text.id, 'text');
                } else {
                  handleTouchMove(e);
                }
              }}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={(e) => handleMouseDown(e, text.id, 'text')}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={(e) => {
                if (text.isSelected) {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -15 : 15;
                  setTextOverlays(textOverlays.map(t => 
                    t.id === text.id 
                      ? { ...t, rotation: (t.rotation || 0) + delta }
                      : t
                  ));
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: text.fontSize,
                  color: text.color,
                  fontFamily: text.fontFamily,
                  fontWeight: text.style === 'bold' ? 'bold' : 'normal',
                  fontStyle: text.style === 'italic' ? 'italic' : 'normal',
                  textAlign: text.alignment,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {text.text}
              </Typography>
              {text.isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 20,
                    height: 20,
                    backgroundColor: '#0095f6',
                    borderRadius: '50%',
                    cursor: 'nw-resize',
                    border: '2px solid white',
                    zIndex: 1001
                  }}
                  onTouchStart={(e) => handleResize(e, text.id, 'text')}
                  onTouchMove={(e) => handleResize(e, text.id, 'text')}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setTextOverlays(textOverlays.map(t => ({ ...t, isResizing: false })));
                  }}
                                  onMouseDown={(e) => handleMouseResize(e, text.id, 'text')}
                onMouseMove={(e) => handleMouseResize(e, text.id, 'text')}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    setTextOverlays(textOverlays.map(t => ({ ...t, isResizing: false })));
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Instagram-style Bottom Tabs */}
      <Box sx={{ backgroundColor: '#000', borderTop: '1px solid #262626' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              minWidth: 'auto', 
              fontSize: '0.75rem',
              textTransform: 'none',
              color: '#8e8e93',
              '&.Mui-selected': {
                color: '#0095f6'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0095f6'
            }
          }}
        >
          <Tab icon={<LooksIcon />} label="Filtros" />
          <Tab icon={<TuneIcon />} label="Ajustes" />
          <Tab icon={<CropIcon />} label="Transformar" />
          <Tab icon={<StickerIcon />} label="Stickers" />
          <Tab icon={<TextIcon />} label="Texto" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ 
        backgroundColor: '#000', 
        p: 2, 
        maxHeight: 200, 
        overflow: 'auto',
        borderTop: '1px solid #262626'
      }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Filtros
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.map((filter) => (
                <Chip
                  key={filter.id}
                  label={filter.name}
                  onClick={() => setSelectedFilter(filter.id)}
                  color={selectedFilter === filter.id ? 'primary' : 'default'}
                  size="small"
                  sx={{
                    backgroundColor: selectedFilter === filter.id ? '#0095f6' : '#262626',
                    color: selectedFilter === filter.id ? 'white' : '#8e8e93',
                    '&:hover': {
                      backgroundColor: selectedFilter === filter.id ? '#0095f6' : '#404040'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Ajustes
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Brillo</Typography>
                <Slider
                  value={brightness}
                  onChange={(e, value) => setBrightness(value as number)}
                  min={50}
                  max={150}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Contraste</Typography>
                <Slider
                  value={contrast}
                  onChange={(e, value) => setContrast(value as number)}
                  min={50}
                  max={150}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Saturación</Typography>
                <Slider
                  value={saturation}
                  onChange={(e, value) => setSaturation(value as number)}
                  min={0}
                  max={200}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Temperatura</Typography>
                <Slider
                  value={temperature}
                  onChange={(e, value) => setTemperature(value as number)}
                  min={-50}
                  max={50}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Transformar
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Rotación</Typography>
                <Slider
                  value={rotation}
                  onChange={(e, value) => setRotation(value as number)}
                  min={-180}
                  max={180}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>Escala</Typography>
                <Slider
                  value={scale}
                  onChange={(e, value) => setScale(value as number)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  size="small"
                  sx={{
                    '& .MuiSlider-track': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-thumb': { backgroundColor: '#0095f6' },
                    '& .MuiSlider-rail': { backgroundColor: '#404040' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={flipHorizontal}
                      onChange={(e) => setFlipHorizontal(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0095f6'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0095f6'
                        }
                      }}
                    />
                  }
                  label="Voltear horizontal"
                  sx={{ color: '#8e8e93' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={flipVertical}
                      onChange={(e) => setFlipVertical(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0095f6'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0095f6'
                        }
                      }}
                    />
                  }
                  label="Voltear vertical"
                  sx={{ color: '#8e8e93' }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Stickers
            </Typography>
            {Object.entries(stickerCategories).map(([category, emojis]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#8e8e93', display: 'block', mb: 1 }}>
                  {category}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {emojis.map((emoji, index) => (
                    <IconButton
                      key={index}
                      onClick={() => addSticker(emoji)}
                      sx={{
                        fontSize: '1.5rem',
                        width: 40,
                        height: 40,
                        border: '1px solid #404040',
                        backgroundColor: '#262626',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#404040',
                          borderColor: '#0095f6'
                        }
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {activeTab === 4 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Texto
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTextOverlay}
              size="small"
              sx={{ 
                mb: 2,
                backgroundColor: '#0095f6',
                '&:hover': { backgroundColor: '#0081d6' }
              }}
            >
              Agregar texto
            </Button>
            
            {textOverlays.map((textOverlay, index) => (
              <Box key={textOverlay.id} sx={{ mb: 2, p: 1, border: '1px solid #404040', borderRadius: 1, backgroundColor: '#262626' }}>
                <Typography variant="caption" sx={{ color: '#8e8e93' }}>
                  Texto {index + 1}
                </Typography>
                <TextField
                  fullWidth
                  label="Texto"
                  value={textOverlay.text}
                  onChange={(e) => {
                    setTextOverlays(textOverlays.map(text =>
                      text.id === textOverlay.id ? { ...text, text: e.target.value } : text
                    ));
                  }}
                  size="small"
                  sx={{ 
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#404040' },
                      '&:hover fieldset': { borderColor: '#0095f6' },
                      '&.Mui-focused fieldset': { borderColor: '#0095f6' }
                    },
                    '& .MuiInputLabel-root': { color: '#8e8e93' }
                  }}
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Tamaño"
                      type="number"
                      value={textOverlay.fontSize}
                      onChange={(e) => {
                        setTextOverlays(textOverlays.map(text =>
                          text.id === textOverlay.id ? { ...text, fontSize: Number(e.target.value) } : text
                        ));
                      }}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#404040' },
                          '&:hover fieldset': { borderColor: '#0095f6' },
                          '&.Mui-focused fieldset': { borderColor: '#0095f6' }
                        },
                        '& .MuiInputLabel-root': { color: '#8e8e93' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Color"
                      type="color"
                      value={textOverlay.color}
                      onChange={(e) => {
                        setTextOverlays(textOverlays.map(text =>
                          text.id === textOverlay.id ? { ...text, color: e.target.value } : text
                        ));
                      }}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#404040' },
                          '&:hover fieldset': { borderColor: '#0095f6' },
                          '&.Mui-focused fieldset': { borderColor: '#0095f6' }
                        },
                        '& .MuiInputLabel-root': { color: '#8e8e93' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: '#000'
          }
        }}
      >
        {!isInEditor ? renderCameraView() : renderEditorView()}
      </Dialog>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          ¡Edición aplicada exitosamente!
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showError}
        autoHideDuration={8000}
        onClose={() => setShowError(false)}
      >
        <Alert 
          severity="error" 
          onClose={() => setShowError(false)}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {errorMessage.includes('Permiso de cámara denegado') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => window.location.reload()}
                  sx={{ color: 'white' }}
                >
                  Recargar
                </Button>
              )}
              {errorMessage.includes('navegador no soporta') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => setShowError(false)}
                  sx={{ color: 'white' }}
                >
                  Usar Biblioteca
                </Button>
              )}
            </Box>
          }
          sx={{
            '& .MuiAlert-message': {
              maxWidth: '300px',
              wordBreak: 'break-word'
            }
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InstagramStyleEditor; 