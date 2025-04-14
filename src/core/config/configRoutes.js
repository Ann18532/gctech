const express = require('express');
const router = express.Router();
const ERPConfig = require('./configModel');
const { verifyToken } = require('../auth/authMiddleware');

// Save or update config
router.post('/', verifyToken, async (req, res) => {
  const { email } = req.user;
  const config = req.body;

  try {
    const saved = await ERPConfig.findOneAndUpdate(
      { email },
      { ...config, email },
      { new: true, upsert: true }
    );
    res.json({ message: 'Config saved', config: saved });
  } catch (err) {
    res.status(500).json({ message: 'Error saving config', error: err.message });
  }
});

// Get config
router.get('/', verifyToken, async (req, res) => {
  try {
    const config = await ERPConfig.findOne({ email: req.user.email });
    if (!config) return res.status(404).json({ message: 'Config not found' });
    res.json({ config });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving config', error: err.message });
  }
});

module.exports = router;
