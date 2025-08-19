import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Paper,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  VolumeUp as VolumeIcon
} from '@mui/icons-material';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration?: number;
  isOwnMessage?: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ 
  audioUrl, 
  duration = 0, 
  isOwnMessage = false 
}) => {
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsLoading(false);
      console.error('Error loading audio');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = newValue as number;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (totalDuration === 0) return 0;
    return (currentTime / totalDuration) * 100;
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
        color: isOwnMessage ? 'white' : 'text.primary',
        borderRadius: 2,
        minWidth: 200,
        maxWidth: 300
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Play/Pause Button */}
        <IconButton
          onClick={togglePlayPause}
          disabled={isLoading}
          size="small"
          sx={{
            color: isOwnMessage ? 'white' : 'primary.main',
            backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.1)',
            '&:hover': {
              backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.3)' : 'rgba(25,118,210,0.2)'
            }
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        {/* Stop Button */}
        <IconButton
          onClick={stopAudio}
          disabled={isLoading || (!isPlaying && currentTime === 0)}
          size="small"
          sx={{
            color: isOwnMessage ? 'white' : 'primary.main',
            backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.1)',
            '&:hover': {
              backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.3)' : 'rgba(25,118,210,0.2)'
            }
          }}
        >
          <StopIcon />
        </IconButton>

        {/* Volume Icon */}
        <VolumeIcon sx={{ fontSize: 16, opacity: 0.7 }} />

        {/* Progress Slider */}
        <Box sx={{ flex: 1, mx: 1 }}>
          <Slider
            value={currentTime}
            max={totalDuration}
            onChange={handleSliderChange}
            disabled={isLoading}
            size="small"
            sx={{
              color: isOwnMessage ? 'white' : 'primary.main',
              '& .MuiSlider-track': {
                backgroundColor: isOwnMessage ? 'white' : 'primary.main'
              },
              '& .MuiSlider-thumb': {
                backgroundColor: isOwnMessage ? 'white' : 'primary.main',
                border: '2px solid',
                borderColor: isOwnMessage ? 'white' : 'primary.main'
              },
              '& .MuiSlider-rail': {
                backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.3)' : 'rgba(25,118,210,0.3)'
              }
            }}
          />
        </Box>

        {/* Time Display */}
        <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'right' }}>
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </Typography>
      </Box>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </Paper>
  );
};

export default VoiceMessagePlayer; 