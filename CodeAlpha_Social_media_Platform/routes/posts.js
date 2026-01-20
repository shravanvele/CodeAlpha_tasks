const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware to authenticate user
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Post.create({
      author: req.userId,
      content: req.body.content
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get feed (all posts)
router.get('/feed', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username displayName')
      .populate('comments.author', 'username displayName')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load feed' });
  }
});

// Like/unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.indexOf(req.userId);
    let liked = false;

    if (index === -1) {
      post.likes.push(req.userId);
      liked = true;
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ liked });
  } catch (err) {
    res.status(500).json({ error: 'Like failed' });
  }
});

// Comment on a post
// Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      author: req.userId,
      text: req.body.text
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Comment failed' });
  }
});

module.exports = router;
