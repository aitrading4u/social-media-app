const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
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

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Other routes (only if they exist)
try {
  app.use('/api/users', require('./routes/users'));
} catch (error) {
  console.log('Users route not available');
}

try {
  app.use('/api/posts', require('./routes/posts'));
} catch (error) {
  console.log('Posts route not available');
}

try {
  app.use('/api/upload', require('./routes/upload'));
} catch (error) {
  console.log('Upload route not available');
}

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