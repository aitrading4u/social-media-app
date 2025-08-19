const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number, // for videos
    width: Number,
    height: Number,
    size: Number,
    cloudinaryId: String
  }],
  hashtags: [{
    type: String,
    trim: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: undefined
    },
    name: String
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video']
      },
      url: String,
      cloudinaryId: String
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 500
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    count: {
      type: Number,
      default: 0
    },
    viewers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isPinned: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isAdultContent: {
    type: Boolean,
    default: false
  },
  contentWarnings: [{
    type: String,
    enum: ['violence', 'nudity', 'language', 'drugs', 'other']
  }],
  monetization: {
    isMonetized: {
      type: Boolean,
      default: false
    },
    tips: [{
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    totalTips: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ 'location.coordinates': '2dsphere' });
postSchema.index({ content: 'text' });

// Update engagement counts
postSchema.pre('save', function(next) {
  this.engagement.likes = this.likes.length;
  this.engagement.comments = this.comments.length;
  this.engagement.shares = this.shares.length;
  this.engagement.views = this.views.count;
  next();
});

// Instance method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Instance method to check if user commented on the post
postSchema.methods.hasCommentedBy = function(userId) {
  return this.comments.some(comment => comment.author.toString() === userId.toString());
};

// Instance method to check if user shared the post
postSchema.methods.isSharedBy = function(userId) {
  return this.shares.some(share => share.user.toString() === userId.toString());
};

// Instance method to check if user viewed the post
postSchema.methods.isViewedBy = function(userId) {
  return this.views.viewers.some(view => view.user.toString() === userId.toString());
};

// Static method to get posts for a user's feed
postSchema.statics.getFeedPosts = function(userId, page = 1, limit = 10) {
  return this.find({
    $or: [
      { author: userId },
      { privacy: 'public' },
      { 
        privacy: 'friends',
        author: { $in: userId.following }
      }
    ],
    isArchived: false
  })
  .populate('author', 'username firstName lastName avatar isVerified')
  .populate('mentions', 'username firstName lastName avatar')
  .populate('likes.user', 'username firstName lastName avatar')
  .populate('comments.author', 'username firstName lastName avatar')
  .populate('shares.user', 'username firstName lastName avatar')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
};

module.exports = mongoose.model('Post', postSchema); 