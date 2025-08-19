const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, [
  body('content')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Content must be less than 2000 characters'),
  body('privacy')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Privacy must be public, friends, or private')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, media, hashtags, mentions, privacy, location, isAdultContent, contentWarnings } = req.body;

    // Create new post
    const post = new Post({
      author: req.user.id,
      content: content || '',
      media: media || [],
      hashtags: hashtags || [],
      mentions: mentions || [],
      privacy: privacy || 'public',
      location: location || null,
      isAdultContent: isAdultContent || false,
      contentWarnings: contentWarnings || []
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'username firstName lastName avatar isVerified');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      error: 'Error creating post' 
    });
  }
});

// @route   GET /api/posts
// @desc    Get posts for user's feed
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user with following list
    const user = await User.findById(req.user.id).populate('following');
    
    // Build query for feed posts
    const query = {
      $or: [
        { author: req.user.id },
        { privacy: 'public' },
        { 
          privacy: 'friends',
          author: { $in: user.following.map(f => f._id) }
        }
      ],
      isArchived: false
    };

    // Filter out adult content if user is not adult
    if (!user.isAdult) {
      query.isAdultContent = false;
    }

    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName avatar isVerified')
      .populate('mentions', 'username firstName lastName avatar')
      .populate('likes.user', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

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
    console.error('Get posts error:', error);
    res.status(500).json({ 
      error: 'Error fetching posts' 
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar isVerified')
      .populate('mentions', 'username firstName lastName avatar')
      .populate('likes.user', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar')
      .populate('shares.user', 'username firstName lastName avatar');

    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    // Check if user can view this post
    const user = await User.findById(req.user.id);
    const canView = post.privacy === 'public' || 
                   post.author._id.toString() === req.user.id ||
                   (post.privacy === 'friends' && user.following.includes(post.author._id));

    if (!canView) {
      return res.status(403).json({ 
        error: 'You cannot view this post' 
      });
    }

    // Filter adult content for non-adult users
    if (!user.isAdult && post.isAdultContent) {
      return res.status(403).json({ 
        error: 'You must be 18+ to view this content' 
      });
    }

    // Add view if not already viewed
    if (!post.isViewedBy(req.user.id)) {
      post.views.count += 1;
      post.views.viewers.push({
        user: req.user.id,
        viewedAt: new Date()
      });
      await post.save();
    }

    res.json({ post });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      error: 'Error fetching post' 
    });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: req.user.id });
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ 
      error: 'Error liking post' 
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to a post
// @access  Private
router.post('/:id/comment', auth, [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    const { content, media } = req.body;

    const comment = {
      author: req.user.id,
      content,
      media: media || [],
      likes: [],
      replies: []
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.author', 'username firstName lastName avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      error: 'Error adding comment' 
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ 
        error: 'You can only delete your own posts' 
      });
    }

    await post.remove();

    res.json({ 
      message: 'Post deleted successfully' 
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      error: 'Error deleting post' 
    });
  }
});

module.exports = router; 