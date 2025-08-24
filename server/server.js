const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🚀 Server starting - VERSION 3.2 - FORCE DEPLOY - Registration endpoint fixed');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Supabase client
let supabase;
const initSupabase = () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.log('⚠️  Supabase credentials not set - server will run without database');
      return false;
    }
    
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
    return true;
  } catch (err) {
    console.error('❌ Supabase initialization failed:', err.message);
    return false;
  }
};

// Initialize Supabase
const supabaseReady = initSupabase();

// Basic routes
app.get('/api/health', (req, res) => {
  try {
    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: supabaseReady ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      supabase_url_set: !!process.env.SUPABASE_URL,
      supabase_key_set: !!process.env.SUPABASE_ANON_KEY,
      jwt_secret_set: !!process.env.JWT_SECRET
    };
    
    console.log('🏥 Health check:', healthInfo);
    res.json(healthInfo);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Supabase test endpoint
app.get('/api/test-supabase', async (req, res) => {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    if (!supabaseReady) {
      return res.json({ 
        error: 'Supabase not initialized',
        supabase_ready: false 
      });
    }
    
    // Test connection by querying a table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase test failed:', error.message);
      return res.json({
        success: false,
        error: error.message,
        error_type: 'query_error'
      });
    }
    
    console.log('✅ Supabase connected successfully!');
    
    res.json({
      success: true,
      message: 'Supabase connected successfully',
      data: data
    });
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    res.json({
      success: false,
      error: error.message,
      error_type: error.name
    });
  }
});

// Real registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔄 Registration attempt:', req.body);
    
    // Check if Supabase is ready
    if (!supabaseReady) {
      console.error('❌ Supabase not initialized');
      return res.status(500).json({ error: 'Supabase not available' });
    }
    
    console.log('✅ Supabase is ready, attempting to create user...');
    
    // Create new user directly (simplified)
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        password: req.body.password,
        date_of_birth: req.body.dateOfBirth,
        bio: '',
        avatar_url: `https://via.placeholder.com/150/8B5CF6/FFFFFF?text=${req.body.firstName.charAt(0).toUpperCase()}`,
        is_verified: false,
        role: 'user',
        preferences: {}
      }])
      .select();
    
    if (insertError) {
      console.error('❌ Error creating user:', insertError);
      return res.status(500).json({ error: 'Database error: ' + insertError.message });
    }
    
    console.log('✅ User created successfully:', newUser[0].id);
    
    // Return user data (without password) - matching the frontend User interface
    const userResponse = {
      id: newUser[0].id,
      username: newUser[0].username,
      email: newUser[0].email,
      displayName: `${newUser[0].first_name} ${newUser[0].last_name}`,
      bio: newUser[0].bio || '',
      avatar: newUser[0].avatar_url || `https://via.placeholder.com/150/8B5CF6/FFFFFF?text=${newUser[0].first_name.charAt(0).toUpperCase()}`,
      isVerified: newUser[0].is_verified || false,
      role: newUser[0].role || 'user',
      preferences: newUser[0].preferences || {}
    };
    
    // Generate a simple token (in production, use proper JWT)
    const token = `token_${newUser[0].id}_${Date.now()}`;
    
    res.json({
      user: userResponse,
      accessToken: token,
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 