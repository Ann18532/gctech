// File: src/leaves/leaveModel.js
const mongoose = require('mongoose');
const { set } = require('../app');

const LeaveSchema = new mongoose.Schema({
  email: { type: String, required: true, set : (v) => v.trim() },
  provider: { type: String, required: true },
  payload: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);
