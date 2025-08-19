const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tokens/balance
// @desc    Get user token balance
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    // Placeholder for token functionality
    res.json({
      balance: 1000,
      earned: 2500,
      spent: 1500
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching balance' });
  }
});

module.exports = router; 