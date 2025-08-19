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
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Common/ToastProvider';


const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { enableDemoMode, isDemoMode } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // TODO: Implement actual login logic
    showError('Login functionality not implemented yet. Use Demo Mode to explore the app.');
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
              disabled
              sx={{ 
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Sign In (Backend Required)
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Social Login */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              sx={{ mb: 2, py: 1.5 }}
              disabled
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Facebook />}
              sx={{ py: 1.5 }}
              disabled
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