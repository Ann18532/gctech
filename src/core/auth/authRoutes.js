const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google OAuth2 login
router.get('/login', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback from Google
router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  (req, res) => {
    const token = jwt.sign(
      {
        email: req.user.email,
        name: req.user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect or render a page, or send token as query param
    res.redirect(`/auth/token?token=${token}`);
  }
);

// Success handler
router.get('/success', (req, res) => {
  if (!req.user) return res.status(401).send("Not authenticated");

  res.json({
    message: "Login successful",
    token,
    user: req.user
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Logout failed");
    res.send("Logged out");
  });
});

// Dev-only: Get current session token
router.get('/token', (req, res) => {
  res.json({
    token: req.query.token,
    user: req.user
  });
});

module.exports = router;

