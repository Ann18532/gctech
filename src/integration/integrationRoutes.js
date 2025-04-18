const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/authMiddleware');
const Integration = require('./integrationModel');
const oracleOAuth = require('./oracleOAuth');
const sapOAuth = require('./sapOAuth'); 
const bambooOAuth = require('./bambooOAuth'); 



/**
 * @swagger
 * /api/integrations/connect:
 *   post:
 *     summary: Initiates OAuth2 connection with ERP (e.g. Oracle)
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [oracle, sap, bamboohr]
 *     responses:
 *       200:
 *         description: Returns redirect URL for ERP OAuth2
 */

// 1. Start OAuth2 connection for ERP (Oracle)
router.post('/connect', verifyToken, async (req, res) => {
  console.log(req);
  const { provider } = req.body;
  const email = req.user.email;

  try {
    let authURL;
    console.log(provider);
    switch (provider?.toLowerCase()) {
      case 'oracle':
        authURL = oracleOAuth.generateAuthURL(email);
        break;
      case 'sap':
        authURL = sapOAuth.generateAuthURL(email);
        break;
      case 'bamboohr':
        authURL = bambooOAuth.generateAuthURL(email);
        break;
      default:
        return res.status(400).json({ message: 'Unsupported ERP provider.' });
    }

    res.json({ auth_url: authURL });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate ERP auth URL', error: err.message });
  }
});



/**
 * @swagger
 * /api/integrations/callback/oracle:
 *   get:
 *     summary: OAuth2 callback handler for Oracle ERP
 *     tags: [Integration]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oracle ERP connected
 */

// 2. OAuth2 callback handler for Oracle
router.get('/callback/oracle', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state.trim();
  console.log("🔥 Oracle callback hit");
  console.log("➡️ Code:", code);
  console.log("➡️ Email from state:", state);

  try {
    const tokens = await oracleOAuth.exchangeCodeForToken(code);
    console.log("🧠 Tokens received:", tokens);

    const integration = await Integration.findOneAndUpdate(
      { email: state },
      {
        provider: 'oracle',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        baseURL: 'https://oracle.example.com',
      },
      { upsert: true, new: true }
    );

    console.log("✅ Integration saved:", integration);
    res.send('✅ Oracle ERP connected. You may close this window.');
  } catch (err) {
    console.error("❌ OAuth callback failed:", err);
    res.status(500).json({ message: 'OAuth callback failed', error: err.message });
  }
});



/**
 * @swagger
 * /api/integrations/callback/sap:
 *   get:
 *     summary: OAuth2 callback handler for SAP ERP
 *     tags: [Integration]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SAP ERP connected
 */

// SAP ERP OAuth2 callback
router.get('/callback/sap', async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokens = await sapOAuth.exchangeCodeForToken(code);
    await Integration.findOneAndUpdate(
      { email: state.trim() },
      {
        provider: 'sap',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        baseURL: 'https://sap.example.com'
      },
      { upsert: true, new: true }
    );
    res.send('✅ SAP ERP connected. You may close this window.');
  } catch (err) {
    res.status(500).json({ message: 'OAuth callback failed', error: err.message });
  }
});



/**
 * @swagger
 * /api/integrations/callback/bamboo:
 *   get:
 *     summary: OAuth2 callback handler for BambooHR
 *     tags: [Integration]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: BambooHR ERP connected
 */

// BambooHR ERP OAuth2 callback
router.get('/callback/bamboohr', async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokens = await bambooOAuth.exchangeCodeForToken(code);
    await Integration.findOneAndUpdate(
      { email: state.trim() },
      {
        provider: 'bamboohr',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        baseURL: `https://mock.bamboohr.com`
      },
      { upsert: true, new: true }
    );
    res.send('✅ BambooHR ERP connected. You may close this window.');
  } catch (err) {
    res.status(500).json({ message: 'OAuth callback failed', error: err.message });
  }
});


router.post('/mock-connect', verifyToken, async (req, res) => {
  console.log(req.user);
  const { provider } = req.body;
  const email = req.user.email;

  if (!['oracle', 'sap', 'bamboohr'].includes(provider)) {
    return res.status(400).json({ message: 'Unsupported ERP provider' });
  }

  try {
    await Integration.findOneAndUpdate(
      { email },
      {
        provider,
        accessToken: `mock-token-${provider}`,
        refreshToken: `mock-refresh-${provider}`,
        baseURL: `https://${provider}.mock.api`
      },
      { upsert: true, new: true }
    );

    res.json({ message: `${provider} connected successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Connection failed', error: err.message });
  }
});



module.exports = router;
