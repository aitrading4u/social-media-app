import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Slider,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Tooltip,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Switch,
  FormControlLabel,
  Stack,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Crop as CropIcon,
  FilterAlt as FilterIcon,
  Tune as AdjustIcon,
  TextFields as TextIcon,
  Brush as BrushIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Download as DownloadIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Flip as FlipIcon,
  Brightness6 as BrightnessIcon,
  Contrast as ContrastIcon,
  Palette as SaturationIcon,
  BlurOn as BlurIcon,
  Grain as GrainIcon,
  AutoAwesome as AutoIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  FormatColorFill as ColorIcon,
  EmojiEmotions as StickerIcon,
  Create as DrawIcon,
  CropFree as CropFreeIcon,
  AspectRatio as AspectRatioIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as FocusIcon,
  Exposure as ExposureIcon,
  WbSunny as WarmthIcon,
  Opacity as OpacityIcon,
  Layers as LayersIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';

interface MediaEditorProps {
  open: boolean;
  onClose: () => void;
  mediaFile: File | null;
  onSave: (editedFile: File) => void;
}

interface Filter {
  id: string;
  name: string;
  icon: React.ReactNode;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grain: number;
  warmth: number;
  exposure: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const MediaEditor: React.FC<MediaEditorProps> = ({
  open,
  onClose,
  mediaFile,
  onSave
}) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grain, setGrain] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [editHistory, setEditHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // New features
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);

  const filters: Filter[] = [
    {
      id: 'normal',
      name: 'Normal',
      icon: <AutoIcon />,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grain: 0,
      warmth: 0,
      exposure: 0
    },
    {
      id: 'vintage',
      name: 'Vintage',
      icon: <FilterIcon />,
      brightness: 110,
      contrast: 120,
      saturation: 80,
      blur: 1,
      grain: 15,
      warmth: 20,
      exposure: -10
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      icon: <ContrastIcon />,
      brightness: 90,
      contrast: 140,
      saturation: 120,
      blur: 0,
      grain: 5,
      warmth: 0,
      exposure: 15
    },
    {
      id: 'warm',
      name: 'Warm',
      icon: <SaturationIcon />,
      brightness: 105,
      contrast: 110,
      saturation: 130,
      blur: 0,
      grain: 0,
      warmth: 30,
      exposure: 5
    },
    {
      id: 'cool',
      name: 'Cool',
      icon: <BlurIcon />,
      brightness: 95,
      contrast: 115,
      saturation: 90,
      blur: 2,
      grain: 0,
      warmth: -20,
      exposure: -5
    },
    {
      id: 'blackwhite',
      name: 'B&W',
      icon: <GrainIcon />,
      brightness: 100,
      contrast: 130,
      saturation: 0,
      blur: 0,
      grain: 10,
      warmth: 0,
      exposure: 0
    },
    {
      id: 'cinematic',
      name: 'Cinematic',
      icon: <FocusIcon />,
      brightness: 85,
      contrast: 150,
      saturation: 110,
      blur: 1,
      grain: 8,
      warmth: 15,
      exposure: 20
    },
    {
      id: 'portrait',
      name: 'Portrait',
      icon: <ColorIcon />,
      brightness: 105,
      contrast: 105,
      saturation: 95,
      blur: 0,
      grain: 0,
      warmth: 10,
      exposure: 5
    }
  ];

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS'
  ];

  const stickerEmojis = ['😀', '😍', '😂', '🎉', '❤️', '🔥', '⭐', '💯', '👍', '👏', '🎵', '📸', '💪', '✨', '🌟', '💎'];

  useEffect(() => {
    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      setMediaUrl(url);
      setMediaType(mediaFile.type.startsWith('image/') ? 'image' : 'video');
      
      // Reset all adjustments
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
      setGrain(0);
      setWarmth(0);
      setExposure(0);
      setRotation(0);
      setIsFlipped(false);
      setSelectedFilter('normal');
      setEditHistory([]);
      setHistoryIndex(-1);
      setTextOverlays([]);
      setStickers([]);
      setZoom(1);
      setCropMode(false);
    }
  }, [mediaFile]);

  useEffect(() => {
    if (selectedFilter !== 'normal') {
      const filter = filters.find(f => f.id === selectedFilter);
      if (filter) {
        setBrightness(filter.brightness);
        setContrast(filter.contrast);
        setSaturation(filter.saturation);
        setBlur(filter.blur);
        setGrain(filter.grain);
        setWarmth(filter.warmth);
        setExposure(filter.exposure);
      }
    }
  }, [selectedFilter, filters]);

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const element = mediaType === 'image' ? imageRef.current : videoRef.current;
    if (!element) return;

    // Set canvas size based on element type
    let width: number;
    let height: number;
    
    if (mediaType === 'image' && imageRef.current) {
      width = imageRef.current.naturalWidth;
      height = imageRef.current.naturalHeight;
    } else if (mediaType === 'video' && videoRef.current) {
      width = videoRef.current.videoWidth;
      height = videoRef.current.videoHeight;
    } else {
      return;
    }
    
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    
    // Center the transformation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply flip
    const scaleX = isFlipped ? -1 : 1;
    ctx.scale(scaleX, 1);
    
    // Apply zoom
    ctx.scale(zoom, zoom);
    
    // Draw the image/video
    ctx.drawImage(
      element,
      -(canvas.width / (2 * zoom)),
      -(canvas.height / (2 * zoom)),
      canvas.width / zoom,
      canvas.height / zoom
    );
    
    ctx.restore();

    // Apply filters using CSS filters
    const filterString = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      blur(${blur}px)
      sepia(${warmth > 0 ? warmth * 0.3 : 0}%)
      hue-rotate(${warmth < 0 ? Math.abs(warmth) * 2 : 0}deg)
    `;
    
    canvas.style.filter = filterString;

    // Apply grain effect
    if (grain > 0) {
      applyGrainEffect(ctx, grain);
    }

    // Draw text overlays
    textOverlays.forEach(overlay => {
      ctx.save();
      ctx.font = `${overlay.isItalic ? 'italic ' : ''}${overlay.isBold ? 'bold ' : ''}${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text, overlay.x, overlay.y);
      ctx.restore();
    });

    // Draw stickers
    stickers.forEach(sticker => {
      ctx.save();
      ctx.font = `${sticker.size}px Arial`;
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx);
    }
  }, [brightness, contrast, saturation, blur, grain, warmth, exposure, rotation, isFlipped, zoom, textOverlays, stickers, showGrid, mediaType]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const applyGrainEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const saveEditState = () => {
    const currentState = {
      brightness,
      contrast,
      saturation,
      blur,
      grain,
      warmth,
      exposure,
      rotation,
      isFlipped,
      selectedFilter,
      textOverlays,
      stickers,
      zoom
    };

    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = editHistory[historyIndex - 1];
      applyState(previousState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      const nextState = editHistory[historyIndex + 1];
      applyState(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyState = (state: any) => {
    setBrightness(state.brightness);
    setContrast(state.contrast);
    setSaturation(state.saturation);
    setBlur(state.blur);
    setGrain(state.grain);
    setWarmth(state.warmth);
    setExposure(state.exposure);
    setRotation(state.rotation);
    setIsFlipped(state.isFlipped);
    setSelectedFilter(state.selectedFilter);
    setTextOverlays(state.textOverlays || []);
    setStickers(state.stickers || []);
    setZoom(state.zoom || 1);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob && mediaFile) {
        const editedFile = new File([blob], mediaFile.name, {
          type: mediaFile.type
        });
        onSave(editedFile);
        onClose();
      }
    }, mediaFile?.type || 'image/jpeg', 0.9);
  };

  const handleRotate = (direction: 'left' | 'right') => {
    saveEditState();
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  const handleFlip = () => {
    saveEditState();
    setIsFlipped(prev => !prev);
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'Add text here',
      x: 100,
      y: 100,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      isBold: false,
      isItalic: false
    };
    setTextOverlays(prev => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => prev.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(text => text.id !== id));
    setSelectedTextId(null);
  };

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji,
      x: 150,
      y: 150,
      size: 40,
      rotation: 0
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === id ? { ...sticker, ...updates } : sticker
    ));
  };

  const removeSticker = (id: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== id));
    setSelectedStickerId(null);
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrain(0);
    setWarmth(0);
    setExposure(0);
    setRotation(0);
    setIsFlipped(false);
    setSelectedFilter('normal');
    setTextOverlays([]);
    setStickers([]);
    setZoom(1);
    setCropMode(false);
    setShowGrid(false);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < editHistory.length - 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: '95vh',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Edit {mediaType === 'image' ? 'Photo' : 'Video'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Reset All">
              <IconButton onClick={resetAll}>
                <ResetIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
              <IconButton onClick={undo} disabled={!canUndo}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton onClick={redo} disabled={!canRedo}>
                <RedoIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Main Editor Area */}
          <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Canvas Container */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.grey[900], 0.1),
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                border: showGrid ? '2px dashed rgba(255,255,255,0.3)' : 'none'
              }}
            >
              {mediaType === 'image' ? (
                <img
                  ref={imageRef}
                  src={mediaUrl}
                  alt="Editing"
                  style={{ display: 'none' }}
                  onLoad={applyFilters}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  style={{ display: 'none' }}
                  onLoadedData={applyFilters}
                  autoPlay
                  muted
                  loop
                />
              )}
              
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  cursor: isDrawing ? 'crosshair' : 'default'
                }}
              />
            </Box>

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Tooltip title="Rotate Left">
                <IconButton onClick={() => handleRotate('left')}>
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate Right">
                <IconButton onClick={() => handleRotate('right')}>
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Flip Horizontal">
                <IconButton onClick={handleFlip}>
                  <FlipIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Grid">
                <IconButton onClick={() => setShowGrid(prev => !prev)}>
                  <AspectRatioIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Text">
                <IconButton onClick={addTextOverlay}>
                  <TextIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Drawing Mode">
                <IconButton 
                  onClick={() => setIsDrawing(prev => !prev)}
                  color={isDrawing ? 'primary' : 'default'}
                >
                  <DrawIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Sidebar Controls */}
          <Box sx={{ width: 380, borderLeft: 1, borderColor: 'divider', p: 2, overflowY: 'auto' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="Filters" />
              <Tab label="Adjust" />
              <Tab label="Text" />
              <Tab label="Stickers" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {/* Filters Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Choose a Filter
                  </Typography>
                  <Grid container spacing={1}>
                    {filters.map((filter) => (
                      <Grid item xs={6} key={filter.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: selectedFilter === filter.id ? 2 : 1,
                            borderColor: selectedFilter === filter.id ? 'primary.main' : 'divider',
                            '&:hover': {
                              borderColor: 'primary.main'
                            }
                          }}
                          onClick={() => setSelectedFilter(filter.id)}
                        >
                          <CardContent sx={{ p: 1, textAlign: 'center' }}>
                            <Box sx={{ color: 'primary.main', mb: 1 }}>
                              {filter.icon}
                            </Box>
                            <Typography variant="caption">
                              {filter.name}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Adjustments Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Adjustments
                  </Typography>
                  
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">Basic Adjustments</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <BrightnessIcon fontSize="small" />
                            <Typography variant="body2">Brightness</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {brightness}%
                            </Typography>
                          </Box>
                          <Slider
                            value={brightness}
                            onChange={(_, value) => setBrightness(value as number)}
                            min={0}
                            max={200}
                            step={1}
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ContrastIcon fontSize="small" />
                            <Typography variant="body2">Contrast</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {contrast}%
                            </Typography>
                          </Box>
                          <Slider
                            value={contrast}
                            onChange={(_, value) => setContrast(value as number)}
                            min={0}
                            max={200}
                            step={1}
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SaturationIcon fontSize="small" />
                            <Typography variant="body2">Saturation</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {saturation}%
                            </Typography>
                          </Box>
                          <Slider
                            value={saturation}
                            onChange={(_, value) => setSaturation(value as number)}
                            min={0}
                            max={200}
                            step={1}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">Advanced Adjustments</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WarmthIcon fontSize="small" />
                            <Typography variant="body2">Warmth</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {warmth}
                            </Typography>
                          </Box>
                          <Slider
                            value={warmth}
                            onChange={(_, value) => setWarmth(value as number)}
                            min={-50}
                            max={50}
                            step={1}
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ExposureIcon fontSize="small" />
                            <Typography variant="body2">Exposure</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {exposure}
                            </Typography>
                          </Box>
                          <Slider
                            value={exposure}
                            onChange={(_, value) => setExposure(value as number)}
                            min={-50}
                            max={50}
                            step={1}
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <BlurIcon fontSize="small" />
                            <Typography variant="body2">Blur</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {blur}px
                            </Typography>
                          </Box>
                          <Slider
                            value={blur}
                            onChange={(_, value) => setBlur(value as number)}
                            min={0}
                            max={10}
                            step={0.5}
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <GrainIcon fontSize="small" />
                            <Typography variant="body2">Grain</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto' }}>
                              {grain}
                            </Typography>
                          </Box>
                          <Slider
                            value={grain}
                            onChange={(_, value) => setGrain(value as number)}
                            min={0}
                            max={50}
                            step={1}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {/* Text Tab */}
              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Text Overlays
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addTextOverlay}
                      variant="outlined"
                    >
                      Add Text
                    </Button>
                  </Box>

                  {textOverlays.map((text) => (
                    <Card key={text.id} sx={{ mb: 2, border: selectedTextId === text.id ? 2 : 1, borderColor: selectedTextId === text.id ? 'primary.main' : 'divider' }}>
                      <CardContent>
                        <TextField
                          fullWidth
                          value={text.text}
                          onChange={(e) => updateTextOverlay(text.id, { text: e.target.value })}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            select
                            value={text.fontFamily}
                            onChange={(e) => updateTextOverlay(text.id, { fontFamily: e.target.value })}
                            size="small"
                            sx={{ flex: 1 }}
                          >
                            {fontFamilies.map((font) => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </TextField>
                          <TextField
                            type="number"
                            value={text.fontSize}
                            onChange={(e) => updateTextOverlay(text.id, { fontSize: parseInt(e.target.value) })}
                            size="small"
                            sx={{ width: 80 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">px</InputAdornment>
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            type="color"
                            value={text.color}
                            onChange={(e) => updateTextOverlay(text.id, { color: e.target.value })}
                            size="small"
                            sx={{ width: 60 }}
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={text.isBold}
                                onChange={(e) => updateTextOverlay(text.id, { isBold: e.target.checked })}
                                size="small"
                              />
                            }
                            label="Bold"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={text.isItalic}
                                onChange={(e) => updateTextOverlay(text.id, { isItalic: e.target.checked })}
                                size="small"
                              />
                            }
                            label="Italic"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => setSelectedTextId(text.id)}
                            variant={selectedTextId === text.id ? 'contained' : 'outlined'}
                          >
                            Select
                          </Button>
                          <Button
                            size="small"
                            onClick={() => removeTextOverlay(text.id)}
                            color="error"
                            variant="outlined"
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Stickers Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Stickers
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ mb: 3 }}>
                    {stickerEmojis.map((emoji) => (
                      <Grid item xs={3} key={emoji}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            p: 1,
                            fontSize: '24px',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                          onClick={() => addSticker(emoji)}
                        >
                          {emoji}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {stickers.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Added Stickers
                      </Typography>
                      {stickers.map((sticker) => (
                        <Card key={sticker.id} sx={{ mb: 1, border: selectedStickerId === sticker.id ? 2 : 1, borderColor: selectedStickerId === sticker.id ? 'primary.main' : 'divider' }}>
                          <CardContent sx={{ p: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ fontSize: '20px' }}>{sticker.emoji}</Box>
                              <TextField
                                type="number"
                                value={sticker.size}
                                onChange={(e) => updateSticker(sticker.id, { size: parseInt(e.target.value) })}
                                size="small"
                                sx={{ width: 80 }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">px</InputAdornment>
                                }}
                              />
                              <Button
                                size="small"
                                onClick={() => setSelectedStickerId(sticker.id)}
                                variant={selectedStickerId === sticker.id ? 'contained' : 'outlined'}
                              >
                                Select
                              </Button>
                              <Button
                                size="small"
                                onClick={() => removeSticker(sticker.id)}
                                color="error"
                                variant="outlined"
                              >
                                <DeleteIcon fontSize="small" />
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
        >
          Save & Use
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaEditor; 