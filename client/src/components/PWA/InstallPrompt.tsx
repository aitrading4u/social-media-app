import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, GetApp as GetAppIcon } from '@mui/icons-material';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };

  return (
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 16, sm: 24 } }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 300,
        }}
      >
        <GetAppIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Install Freedom Social
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add to home screen for quick access
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleInstall}
          sx={{ mr: 1 }}
        >
          Install
        </Button>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default InstallPrompt; 