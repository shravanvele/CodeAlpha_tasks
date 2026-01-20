const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get profile by username
router.get('/:username', async (req, res) => {
  try {
    const u = await User.findOne({ username: req.params.username })
      .select('-passwordHash')
      .populate('followers', 'username displayName')
      .populate('following', 'username displayName');
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Follow/unfollow
router.post('/:username/follow', auth, async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ error: 'User not found' });
    const me = req.user;
    const isFollowing = me.following.some(id => id.equals(target._id));
    if (isFollowing) {
      me.following = me.following.filter(id => !id.equals(target._id));
      target.followers = target.followers.filter(id => !id.equals(me._id));
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    await me.save();
    await target.save();
    res.json({ success: true, following: !isFollowing });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Edit profile
router.put('/me', auth, async (req, res) => {
  try {
    const { displayName, bio } = req.body;
    if (displayName !== undefined) req.user.displayName = displayName;
    if (bio !== undefined) req.user.bio = bio;
    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
