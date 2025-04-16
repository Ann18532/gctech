// File: src/leaves/adapters/sapAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const Leave = require('../leaveModel');

//real

// // SAP Leave GET Adapter
// async function getLeavesSAP(accessToken) {
//   // Replace with your real SAP endpoint
//   const response = await axios.get('https://sap.example.com/odata/v2/LeaveRequestCollection', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       Accept: 'application/json'
//     }
//   });
//   return response.data.d?.results || [];
// }

// // SAP Leave POST Adapter
// async function createLeaveSAP(accessToken, universalLeave) {
//   const body = {
//     LeaveType: universalLeave.leave_reason,
//     StartDate: universalLeave.leave_start,
//     EndDate: universalLeave.leave_end
//   };

//   const response = await axios.post('https://sap.example.com/odata/v2/LeaveRequestCollection', body, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// }



//dev

// SAP Leave GET Adapter (Mocked)

async function getLeavesSAP(accessToken, userEmail) {
    const records = await Leave.find({ email: userEmail, provider: "sap" });
    return records.map(r => r.payload);
  }
  
  // SAP Leave POST Adapter (Mocked)
  async function createLeaveSAP(accessToken, universalLeave, userEmail) {
    const targetFields = [
      "RequestID", "LeaveType", "LeaveReason", "Cause",
      "StartDate", "from", "FromDate",
      "EndDate", "to", "ToDate",
      "ApprovalStatus", "status", "LeaveStatus"
    ];
  
    const erpBody = {};
    for (const key in universalLeave) {
      const match = aiMatchField(key, targetFields);
      if (match && match.match) {
        erpBody[match.match] = universalLeave[key];
        console.log(`🧠 AI Mapped (SAP): ${key} → ${match.match} (${match.confidence}%)`);
      } else {
        console.log(`⚠️ No SAP mapping found for ${key}`);
      }
    }
  
    erpBody.ApprovalStatus = erpBody.ApprovalStatus || "Submitted";
  
    const record = await Leave.create({
      email: userEmail,
      provider: "sap",
      payload: erpBody
    });
  
    return record.payload;
  }


module.exports = { getLeavesSAP, createLeaveSAP };
