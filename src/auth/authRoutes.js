const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { issueJWT, verifyToken } = require('../utils/authUtils');

// Google OAuth2 login
router.get('/login', passport.authenticate('google', {
  scope: ['profile', 'email']
}));


/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: Google OAuth2 callback handler
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sets JWT cookie and redirects to frontend
 */

// Callback from Google
router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/auth/failure',
  session: false
}), (req, res) => {
  const jwt = issueJWT(req.user); // your JWT creation function
  res.cookie('token', jwt, {
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  });

  // Redirect to React frontend with optional token param
  res.redirect(`http://localhost:5173/dashboard`);
})

// Success handler
router.get('/success', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = verifyToken(token); // your token verifier
    res.json({
      token,
      user
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs out the current user and clears token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// Dev-only: Get current session token
router.get('/token', (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("Token is missing");
  }

  // Set the token as a cookie
  res.cookie('auth_token', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000 // 1 hour
  });

  res.json({
    message: "Token set as cookie",
    user: req.user
  });
});

module.exports = router;

