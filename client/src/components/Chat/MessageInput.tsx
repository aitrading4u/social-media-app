import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (message: string, mediaType?: string, mediaUrl?: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<{ type: string; url: string; name: string } | null>(null);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage('', 'audio', audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('No se pudo acceder al micrófono');
    }
  }, [onSendMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setRecordingTime(0);
    }
  }, [isRecording]);

  const handleSendMessage = () => {
    if (message.trim() || mediaPreview) {
      if (mediaPreview) {
        onSendMessage(message, mediaPreview.type, mediaPreview.url);
        setMediaPreview(null);
      } else {
        onSendMessage(message);
      }
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview({ type, url, name: file.name });
      setShowMediaDialog(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'file')}
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'image')}
        accept="image/*"
      />
      <input
        ref={videoInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'video')}
        accept="video/*"
      />

      {/* Recording progress */}
      {isRecording && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="error.contrastText">
              Grabando: {formatTime(recordingTime)}
            </Typography>
            <IconButton
              size="small"
              onClick={stopRecording}
              sx={{ ml: 'auto', color: 'error.contrastText' }}
            >
              <StopIcon />
            </IconButton>
          </Box>
          <LinearProgress variant="determinate" value={(recordingTime % 60) / 60 * 100} />
        </Paper>
      )}

      {/* Media preview dialog */}
      <Dialog open={showMediaDialog} onClose={() => setShowMediaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Vista previa del archivo
          <IconButton
            onClick={() => setShowMediaDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {mediaPreview && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {mediaPreview.name}
              </Typography>
              {mediaPreview.type === 'image' && (
                <img
                  src={mediaPreview.url}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
              )}
              {mediaPreview.type === 'video' && (
                <video
                  src={mediaPreview.url}
                  controls
                  style={{ width: '100%', maxHeight: 300 }}
                />
              )}
              {mediaPreview.type === 'file' && (
                <Chip
                  icon={<AttachFileIcon />}
                  label={mediaPreview.name}
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMediaDialog(false)}>Cancelar</Button>
          <Button onClick={handleSendMessage} variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main input area */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        {/* Attachment buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleAttachClick}
            disabled={disabled}
            title="Adjuntar archivo"
          >
            <AttachFileIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleImageClick}
            disabled={disabled}
            title="Adjuntar imagen"
          >
            <ImageIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleVideoClick}
            disabled={disabled}
            title="Adjuntar video"
          >
            <VideoIcon />
          </IconButton>
        </Box>

        {/* Text input */}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          disabled={disabled || isRecording}
          sx={{ flex: 1 }}
        />

        {/* Send/Record button */}
        <IconButton
          onClick={isRecording ? stopRecording : handleSendMessage}
          disabled={disabled || (!message.trim() && !mediaPreview)}
          color={isRecording ? 'error' : 'primary'}
          title={isRecording ? 'Detener grabación' : 'Enviar mensaje'}
        >
          {isRecording ? <StopIcon /> : <SendIcon />}
        </IconButton>

        {/* Voice recording button */}
        {!isRecording && (
          <IconButton
            onClick={startRecording}
            disabled={disabled}
            color="secondary"
            title="Grabar mensaje de voz"
          >
            <MicIcon />
          </IconButton>
        )}
      </Box>

      {/* Media preview chip */}
      {mediaPreview && !showMediaDialog && (
        <Box sx={{ mt: 1 }}>
          <Chip
            label={mediaPreview.name}
            onDelete={() => setMediaPreview(null)}
            variant="outlined"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default MessageInput; 