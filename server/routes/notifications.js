const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Placeholder for notifications functionality
    res.json({
      notifications: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router; 