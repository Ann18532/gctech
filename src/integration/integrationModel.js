// File: src/integration/integrationModel.js
const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, set: (v) => v.trim() },
  provider: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  baseURL: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Integration', IntegrationSchema);
