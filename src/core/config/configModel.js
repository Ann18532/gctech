const mongoose = require('mongoose');

const ERPConfigSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  baseURL: { type: String, required: true },
  auth: {
    type: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  endpoints: {
    employees: { type: String, required: true }
  }
}, { timestamps: true });

const ERPConfig = mongoose.model('ERPConfig', ERPConfigSchema);
module.exports = ERPConfig;
