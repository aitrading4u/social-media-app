import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
  useTheme
} from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Loading...',
  fullScreen = false
}) => {
  const theme = useTheme();

  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }}
        open={open}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: 'white',
              fontWeight: 500
            }}
          >
            {message}
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: open ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1,
        borderRadius: 1
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: 'text.secondary'
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingOverlay; 