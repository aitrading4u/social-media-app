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
  Grid,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Person, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Google,
  Facebook
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';


const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    referralCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Check if all required fields are filled
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || !formData.dateOfBirth) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          referralCode: formData.referralCode || undefined
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Login the user automatically
      login(data.user, data.accessToken);
      
      // Redirect to home page
      navigate('/');
      
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 500 }}>
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
              Join TIPPER
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and start tipping freely
            </Typography>
          </Box>

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Email"
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Referral Code (Optional)"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              margin="normal"
              helperText="Enter a friend's referral code to get 10 bonus tokens"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Demo Mode Alert */}
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>Demo Mode:</strong> If registration fails, you can use demo mode to explore the application.
              </Typography>
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Demo Mode Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              sx={{ 
                py: 1.5,
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                }
              }}
              onClick={() => {
                const { enableDemoMode } = useAuthStore.getState();
                enableDemoMode();
                navigate('/');
              }}
            >
              Try Demo Mode
            </Button>
          </Box>

          {/* Social Register */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              sx={{ mb: 2, py: 1.5 }}
              onClick={() => {
                // TODO: Implement Google OAuth
                alert('Google OAuth coming soon!');
              }}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Facebook />}
              sx={{ py: 1.5 }}
              onClick={() => {
                // TODO: Implement Facebook OAuth
                alert('Facebook OAuth coming soon!');
              }}
            >
              Sign up with Facebook
            </Button>
          </Box>

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Floating Action Button */}
      {/* Removed FloatingActionButton import, so this section is removed */}
    </Container>
  );
};

export default Register; 