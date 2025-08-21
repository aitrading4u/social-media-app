// Force new deployment - Build fix applied
// DEPLOYMENT TRIGGER: Latest commit d748f19 with all build fixes
// VERCEL DEPLOYMENT FIX: This should trigger a new build with updated config
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box, Typography } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import PostDetail from './pages/Post/PostDetail';
import Explore from './pages/Explore/Explore';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import Settings from './pages/Settings/Settings';
import Search from './pages/Search/Search';
import LiveStreamingPage from './pages/LiveStreaming/LiveStreamingPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import AIRecommendationsPage from './pages/AI/AIRecommendationsPage';
import MarketplacePage from './pages/Monetization/MarketplacePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { ToastProvider } from './components/Common/ToastProvider';
import { setupGlobalErrorHandler } from './utils/errorHandler';
import MessagingApp from './components/Chat/MessagingApp';
import NotificationsApp from './components/Notifications/NotificationsApp';
import ServiceWorkerRegistration from './components/PWA/ServiceWorkerRegistration';
import InstallPrompt from './components/PWA/InstallPrompt';

// Create a custom theme with violet and yellow colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5CF6', // Violet
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B', // Amber/Yellow
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🚀 App starting...');
    
    try {
      // Setup global error handler
      setupGlobalErrorHandler();
      console.log('✅ Error handler setup complete');
      
      // Simulate a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        console.log('✅ Loading complete, showing app');
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('❌ Error during app initialization:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="background.default"
          p={3}
        >
          <Typography variant="h4" color="error" gutterBottom>
            App Error
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Please refresh the page or check the console for more details.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="background.default"
        >
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading Social Media App...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  console.log('🎯 Rendering main app...');

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/live" element={<ProtectedRoute><LiveStreamingPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/ai-recommendations" element={<ProtectedRoute><AIRecommendationsPage /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
            
            {/* Global Floating Action Buttons */}
            <MessagingApp />
            <NotificationsApp />
            
            {/* PWA Components */}
            <ServiceWorkerRegistration />
            <InstallPrompt />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 