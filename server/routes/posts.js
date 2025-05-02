const express = require('express');
const Post = require('../models/Post');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user.id });
  res.status(201).json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author');
  res.json(post);
});

router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.id) return res.sendStatus(403);
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.id) return res.sendStatus(403);
  // await post.remove();
  await Post.deleteOne({ _id: req.params.id });

  res.sendStatus(204);
});
router.post('/like/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user.id)) {
    post.likes.push(req.user.id);
    await post.save();
  }
  res.json(post);
});

router.post('/unlike/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
  await post.save();
  res.json(post);
});


module.exports = router;
