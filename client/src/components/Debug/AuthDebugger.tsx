import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuthStore } from '../../stores/authStore';

const AuthDebugger: React.FC = () => {
  const authState = useAuthStore();

  const logAuthState = () => {
    console.log('🔍 Current Auth State:', authState);
    console.log('🔍 Is Authenticated:', authState.isAuthenticated);
    console.log('🔍 Is Demo Mode:', authState.isDemoMode);
    console.log('🔍 User:', authState.user);
  };

  const testRealAuth = () => {
    console.log('🧪 Testing real authentication...');
    
    // Simulate a real user login
    const realUser = {
      id: 'real-user-123',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      bio: 'Test user for debugging',
      avatar: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=T',
      isVerified: false,
      role: 'user',
      preferences: {}
    };
    
    console.log('🧪 Setting real user:', realUser);
    authState.login(realUser, 'real-jwt-token');
    
    console.log('🧪 Auth state after login:', useAuthStore.getState());
  };

  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Auth Debugger
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Is Authenticated:</strong> {authState.isAuthenticated ? '✅ Yes' : '❌ No'}
        </Typography>
        <Typography variant="body2">
          <strong>Is Demo Mode:</strong> {authState.isDemoMode ? '✅ Yes' : '❌ No'}
        </Typography>
        <Typography variant="body2">
          <strong>User:</strong> {authState.user ? JSON.stringify(authState.user, null, 2) : 'None'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" onClick={logAuthState}>
          Log Auth State
        </Button>
        <Button variant="outlined" size="small" onClick={testRealAuth}>
          Test Real Auth
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthDebugger; 