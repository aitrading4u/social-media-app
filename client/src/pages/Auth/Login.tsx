import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  TextField, 
  Paper, 
  Avatar,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Google,
  Facebook,
  PlayArrow
} from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Common/ToastProvider';


const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { enableDemoMode, isDemoMode, login } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔄 Login attempt:', formData);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // Can be username or email
          email: formData.email,    // Can be username or email
          password: formData.password
        }),
      });

      console.log('📡 Login response status:', response.status);

      const data = await response.json();
      console.log('📡 Login response data:', data);

      if (!response.ok) {
        console.error('❌ Login failed:', data.error);
        throw new Error(data.error || 'Login failed');
      }

      console.log('✅ Login successful, logging in user...');
      
      // Login the user
      login(data.user, data.accessToken);
      
      console.log('✅ User logged in, redirecting to home...');
      
      showSuccess('Login successful! Welcome back.');
      
      // Redirect to home page
      navigate('/');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        showError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        showError(err.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleDemoMode = () => {
    enableDemoMode();
    showSuccess('Demo mode activated! Welcome to the social network.');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('🔄 Google login success:', credentialResponse);
      
      // Send the credential to our backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        }),
      });

      const data = await response.json();
      console.log('📡 Google login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      // Login the user
      login(data.user, data.accessToken);
      showSuccess('Google login successful! Welcome.');
      navigate('/');
      
    } catch (err: any) {
      console.error('❌ Google login error:', err);
      showError(err.message || 'Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google login error');
    showError('Google login failed. Please try again.');
  };

  const handleFacebookLogin = () => {
    console.log('🔄 Facebook login clicked');
    showError('Facebook login not implemented yet. Please use Google login or email/password.');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <Typography variant="h4">T</Typography>
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your TIPPER account
            </Typography>
          </Box>

          {/* Demo Mode Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Demo Mode:</strong> Since the backend is not available, you can use demo mode to explore the application.
            </Typography>
          </Alert>

          {/* Demo Mode Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleDemoMode}
            sx={{ 
              mb: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
              }
            }}
          >
            Try Demo Mode
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email or Username"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
              <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Social Login */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Facebook />}
              onClick={handleFacebookLogin}
              sx={{ py: 1.5 }}
            >
              Continue with Facebook
            </Button>
          </Box>

          {/* Demo Mode Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleDemoMode}
              startIcon={<PlayArrow />}
              sx={{ 
                py: 1.5,
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                }
              }}
            >
              Try Demo Mode
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/register" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>


    </Container>
  );
};

export default Login; 