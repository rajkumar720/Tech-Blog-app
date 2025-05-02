const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Get posts by a user
router.get('/:userId/posts', async (req, res) => {
  const posts = await Post.find({ author: req.params.userId }).populate('author', 'username');
  res.json(posts);
});

module.exports = router;
