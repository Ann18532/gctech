const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/authMiddleware');
const Integration = require('../integration/integrationModel');
const { normalizeLeaveResponse } = require('./normalize');

const { createLeaveOracle, getLeavesOracle } = require('./adapters/oracleAdapter');
const { createLeaveSAP, getLeavesSAP } = require('./adapters/sapAdapter');
const { createLeaveBamboo, getLeavesBamboo } = require('./adapters/bambooAdapter');

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

    const leaves = normalizeLeaveResponse(rawLeaves, integration.provider);
    res.json({ data: leaves });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving leaves', error: err.message });
  }
});

module.exports = router;
