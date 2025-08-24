const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('🔗 URI format check:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not set');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    
    // Test creating a collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Write test successful!');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testConnection();
