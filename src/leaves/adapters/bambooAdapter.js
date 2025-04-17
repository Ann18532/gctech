// File: src/leaves/adapters/bambooAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const Leave = require('../leaveModel');
const { BambooLeave } = require('../../integration/integrationModel');

//real

// // BambooHR Leave GET Adapter
// async function getLeavesBamboo(accessToken, baseURL) {
//   const response = await axios.get(`${baseURL}/v1/time_off/requests`, {
//     headers: {
//       Authorization: `Basic ${Buffer.from(accessToken + ':x').toString('base64')}`,
//       Accept: 'application/json'
//     }
//   });
//   return response.data?.requests || [];
// }

// // BambooHR Leave POST Adapter
// async function createLeaveBamboo(accessToken, baseURL, universalLeave) {
//   const body = {
//     start: universalLeave.leave_start,
//     end: universalLeave.leave_end,
//     type: universalLeave.leave_reason
//   };

//   const response = await axios.post(`${baseURL}/v1/time_off/requests`, body, {
//     headers: {
//       Authorization: `Basic ${Buffer.from(accessToken + ':x').toString('base64')}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// }

//dev


// BambooHR Leave GET Adapter (Mocked)
async function getLeavesBamboo(accessToken, baseURL, userEmail) {
    const records = await BambooLeave.find({ email: userEmail, provider: "bamboohr" });
    return records.map(r => r.payload);
  }
  
  // BambooHR Leave POST Adapter (Mocked)
  async function createLeaveBamboo(accessToken, baseURL, universalLeave, userEmail) {
    const targetFields = ["staffMember", "staffEmail", "beginDate", "finishDate", "timeOffReason", "status"];
  
    const erpBody = {};
    const missing = [];

    for (const erpField in targetFields) {
        const match = aiMatchField(erpField, Object.keys(universalLeave));    if (match && match.match) {
          if (!match || match.confidence < 0.75 || !universalLeave[match.match]) {
            missing.push(erpField);
          } else {
            erpBody[erpField] = universalLeave[match.match];
          }
        console.log(`🧠 AI Mapped (Oracle): ${erpField} → ${match.match} (${match.confidence}%)`);
      }
    }
  
  
    if (missing.length > 0) {
      throw new Error(`Missing required ERP field mappings for: ${missing.join(", ")}`);
    }
  
    const record = await BambooLeave.create({
      email: userEmail,
      provider: "bamboohr",
      payload: erpBody
    });
  
    return record.payload;
  }

module.exports = { getLeavesBamboo, createLeaveBamboo };