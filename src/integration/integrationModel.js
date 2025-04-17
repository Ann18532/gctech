const mongoose = require('mongoose');

// Oracle ERP Leave Schema
const oracleLeaveSchema = new mongoose.Schema({
  email: String,
  provider: { type: String, default: 'oracle' },
  payload: {
    FullName: String,
    EmailID: String,
    StartDate: String,
    EndDate: String,
    LeaveType: String,
    ApprovalStatus: String
  }
}, { timestamps: true });

// SAP ERP Leave Schema
const sapLeaveSchema = new mongoose.Schema({
  email: String,
  provider: { type: String, default: 'sap' },
  payload: {
    EmployeeName: String,
    ContactEmail: String,
    FromDate: String,
    ToDate: String,
    ReasonForLeave: String
  }
}, { timestamps: true });

// BambooHR ERP Leave Schema
const bambooLeaveSchema = new mongoose.Schema({
  email: String,
  provider: { type: String, default: 'bamboohr' },
  payload: {
    staffMember: String,
    staffEmail: String,
    beginDate: String,
    finishDate: String,
    timeOffReason: String,
    status: String
  }
}, { timestamps: true });

module.exports = {
  OracleLeave: mongoose.model('OracleLeave', oracleLeaveSchema),
  SapLeave: mongoose.model('SapLeave', sapLeaveSchema),
  BambooLeave: mongoose.model('BambooLeave', bambooLeaveSchema)
};
