const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Server starting - VERSION 2.1 - Registration endpoint fixed');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set - server will run without database');
      return;
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🔗 URI format check:', process.env.MONGODB_URI.substring(0, 30) + '...');
    console.log('🔗 Full URI length:', process.env.MONGODB_URI.length);
    console.log('🔗 URI contains database name:', process.env.MONGODB_URI.includes('/freedom_social'));
    console.log('🔗 URI contains retryWrites:', process.env.MONGODB_URI.includes('retryWrites=true'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🔍 Error details:', err);
    console.log('⚠️  Server will run without database');
  }
};

// Connect to database
connectDB();

// Basic routes
app.get('/api/health', (req, res) => {
  try {
    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      jwt_secret_set: !!process.env.JWT_SECRET,
      cloudinary_set: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
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

// MongoDB test endpoint
app.get('/api/test-mongodb', async (req, res) => {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    if (!process.env.MONGODB_URI) {
      return res.json({ 
        error: 'MONGODB_URI not set',
        uri_set: false 
      });
    }
    
    console.log('🔗 URI length:', process.env.MONGODB_URI.length);
    console.log('🔗 URI starts with:', process.env.MONGODB_URI.substring(0, 20));
    console.log('🔗 URI contains database:', process.env.MONGODB_URI.includes('/freedom_social'));
    
    // Test connection
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    res.json({
      success: true,
      message: 'MongoDB connected successfully',
      database: connection.connection.db.databaseName,
      connection_state: mongoose.connection.readyState
    });
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('🔍 Full error:', error);
    
    res.json({
      success: false,
      error: error.message,
      error_type: error.name,
      connection_state: mongoose.connection.readyState
    });
  }
});

// Real registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔄 Registration attempt:', req.body);
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Check if JWT secret is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Create a simple user document (you can expand this later)
    const User = mongoose.model('User', new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      isDemoMode: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }));
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: req.body.email }, { username: req.body.username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // In production, hash this!
      dateOfBirth: req.body.dateOfBirth,
      isDemoMode: false
    });
    
    await user.save();
    
    console.log('✅ User created successfully:', user._id);
    
    // Return user data (without password) - matching the frontend User interface
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      bio: '',
      avatar: `https://via.placeholder.com/150/8B5CF6/FFFFFF?text=${user.firstName.charAt(0).toUpperCase()}`,
      isVerified: false,
      role: 'user',
      preferences: {}
    };
    
    // Generate a simple token (in production, use proper JWT)
    const token = `token_${user._id}_${Date.now()}`;
    
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