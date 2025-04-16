// File: src/leaves/adapters/bambooAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const Leave = require('../leaveModel');

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
    const records = await Leave.find({ email: userEmail, provider: "bamboohr" });
    return records.map(r => r.payload);
  }
  
  // BambooHR Leave POST Adapter (Mocked)
  async function createLeaveBamboo(accessToken, baseURL, universalLeave, userEmail) {
    const targetFields = [
      "id", "LeaveCode", "reason", "type",
      "start", "StartDate", "from", "beginDate",
      "end", "EndDate", "to", "finishDate",
      "status", "approval", "LeaveStatus"
    ];
  
    const erpBody = {};
    for (const key in universalLeave) {
      const match = aiMatchField(key, targetFields);
      if (match && match.match) {
        erpBody[match.match] = universalLeave[key];
        console.log(`🧠 AI Mapped (BambooHR): ${key} → ${match.match} (${match.confidence}%)`);
      } else {
        console.log(`⚠️ No BambooHR mapping found for ${key}`);
      }
    }
  
    erpBody.status = erpBody.status || "Pending";
  
    const record = await Leave.create({
      email: userEmail,
      provider: "bamboohr",
      payload: erpBody
    });
  
    return record.payload;
  }

module.exports = { getLeavesBamboo, createLeaveBamboo };