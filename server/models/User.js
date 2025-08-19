const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdult: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tokenBalance: {
    type: Number,
    default: 100 // Starting balance
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  creatorProfile: {
    category: String,
    description: String,
    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      tiktok: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      showOnlineStatus: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    },
    content: {
      showAdultContent: { type: Boolean, default: false },
      contentWarnings: { type: Boolean, default: true }
    }
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = this.username + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Check if user is adult based on date of birth
userSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const age = Math.floor((new Date() - new Date(this.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
    this.isAdult = age >= 18;
  }
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    avatar: this.avatar,
    bio: this.bio,
    isCreator: this.isCreator,
    creatorProfile: this.creatorProfile,
    followers: this.followers.length,
    following: this.following.length,
    isOnline: this.isOnline,
    lastSeen: this.lastSeen,
    createdAt: this.createdAt
  };
};

// Static method to find by username or email
userSchema.statics.findByUsernameOrEmail = function(identifier) {
  return this.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });
};

module.exports = mongoose.model('User', userSchema); 