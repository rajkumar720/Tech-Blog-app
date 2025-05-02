const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/:postId', auth, async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    author: req.user.id,
    post: req.params.postId
  });
  res.status(201).json(comment);
});

router.get('/:postId', async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
  res.json(comments);
});

module.exports = router;