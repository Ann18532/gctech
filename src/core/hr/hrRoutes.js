const express = require('express');
const router = express.Router();
const { getConfigForUser } = require('../config/configStorage');
const { fetchEmployeesFromBambooHR } = require('./bambooHR');
const { normalizeEmployeeList } = require('./normalizeEmployee');
const { verifyToken } = require('../auth/authMiddleware');


router.get('/employees', verifyToken, async (req, res) => {
  const user = req.user;
  const config = getConfigForUser(user.email);

  if (!config || config.provider !== 'bamboohr') {
    return res.status(400).json({ message: "No valid BambooHR config for user." });
  }

  try {
    const rawEmployees = await fetchEmployeesFromBambooHR(config);
    const employees = normalizeEmployeeList(rawEmployees);
    res.json({ data: employees });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
});

module.exports = router;
