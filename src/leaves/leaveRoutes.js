

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/authMiddleware');
const Integration = require('../integration/integrationModel');
const { aiNormalizeResponse } = require('../ai-tools/responseMapper');


const { createLeaveOracle, getLeavesOracle } = require('./adapters/oracleAdapter');
const { createLeaveSAP, getLeavesSAP } = require('./adapters/sapAdapter');
const { createLeaveBamboo, getLeavesBamboo } = require('./adapters/bambooAdapter');
/**
 * @swagger
 * /api/leaves:
 *   post:
 *     summary: Submit a leave request
 *     tags: [Leaves]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - leave_start
 *               - leave_end
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               leave_start:
 *                 type: string
 *               leave_end:
 *                 type: string
 *               leave_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Missing fields or invalid format
 */

// ✅ POST /leaves (no AI mapping here — universal fields only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const integration = await Integration.findOne({ email: user.email });
    if (!integration) return res.status(400).json({ message: 'No ERP connected for user.' });

    let result;
    const universalPayload = req.body; // trusted universal field names
    console.log(integration.provider);
    console.log(universalPayload);
    if (integration.provider === 'oracle') {
      result = await createLeaveOracle(integration.accessToken, universalPayload, user.email);
    } else if (integration.provider === 'sap') {
      result = await createLeaveSAP(integration.accessToken, universalPayload, user.email);
    } else if (integration.provider === 'bamboohr') {
      result = await createLeaveBamboo(integration.accessToken, integration.baseURL, universalPayload, user.email);
    } else {
      return res.status(400).json({ message: 'Unsupported ERP provider' });
    }

    res.json({ message: 'Leave request created successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting leave request', error: err.message });
  }
});


/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Get all leave requests from connected ERP
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: { type: string }
 *                       email: { type: string }
 *                       leave_start: { type: string }
 *                       leave_end: { type: string }
 *                       leave_reason: { type: string }
 *                       leave_id: { type: number }
 *       400:
 *         description: ERP not connected
 *       500:
 *         description: Server error
 */

// ✅ GET /leaves — normalize using AI after fetching from ERP
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const integration = await Integration.findOne({ email: user.email });
    if (!integration) return res.status(400).json({ message: 'No ERP connected for user.' });

    let rawLeaves = [];
    if (integration.provider === 'oracle') {
      console.log(integration.accessToken, );
      rawLeaves = await getLeavesOracle(integration.accessToken, user.email);
    } else if (integration.provider === 'sap') {
      rawLeaves = await getLeavesSAP(integration.accessToken, user.email);
    } else if (integration.provider === 'bamboohr') {
      rawLeaves = await getLeavesBamboo(integration.accessToken, integration.baseURL, user.email);
    } else {
      return res.status(400).json({ message: 'Unsupported ERP provider' });
    }
    // console.log(rawLeaves);
    const leaves = await Promise.all(
      rawLeaves.map(entry => aiNormalizeResponse(entry))
    );

    res.json({ data: leaves });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving leaves', error: err.message });
  }
});

module.exports = router;
