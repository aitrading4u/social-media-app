const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Get user profile
// @access  Public
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username firstName lastName avatar')
      .populate('following', 'username firstName lastName avatar');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({ user: user.getPublicProfile() });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Error fetching profile' 
    });
  }
});

// @route   PUT /api/users/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.put('/follow/:userId', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    
    if (!userToFollow) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    if (userToFollow._id.toString() === req.user.id) {
      return res.status(400).json({ 
        error: 'You cannot follow yourself' 
      });
    }

    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      message: isFollowing ? 'User unfollowed' : 'User followed',
      isFollowing: !isFollowing
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ 
      error: 'Error following user' 
    });
  }
});

// @route   GET /api/users/:userId/posts
// @desc    Get user's posts
// @access  Public
router.get('/:userId/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      author: req.params.userId,
      isArchived: false 
    })
    .populate('author', 'username firstName lastName avatar isVerified')
    .populate('likes.user', 'username firstName lastName avatar')
    .populate('comments.author', 'username firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Post.countDocuments({ 
      author: req.params.userId,
      isArchived: false 
    });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ 
      error: 'Error fetching user posts' 
    });
  }
});

module.exports = router; 