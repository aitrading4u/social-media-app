import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
            backgroundColor: 'grey.50'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 400,
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'error.main' }}>
              ¡Ups! Algo salió mal
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Ha ocurrido un error inesperado. Intenta recargar la página.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRefresh}
              sx={{ mb: 2 }}
            >
              Recargar página
            </Button>
            {this.state.error && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Error: {this.state.error.message}
              </Typography>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 