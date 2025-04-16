// File: src/leaves/adapters/oracleAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const Leave = require('../leaveModel');

// Oracle Leave GET Adapter

//real

// async function getLeavesOracle(accessToken) {
//   const response = await axios.get('https://oracle.example.com/hcm/leaves', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       Accept: 'application/json'
//     }
//   });
//   return response.data.items || [];
// }

//test

async function getLeavesOracle(accessToken, userEmail) {
  console.log(userEmail); 
  const records = await Leave.find({ email: userEmail, provider: "oracle" });
  console.log("📦 Oracle DB records found:", records.length);
  return records.map(r => r.payload);
}
  

// Oracle Leave POST Adapter

//real 

// async function createLeaveOracle(accessToken, universalLeave) {
//   const body = {
//     Reason: universalLeave.leave_reason,
//     StartDate: universalLeave.leave_start,
//     EndDate: universalLeave.leave_end
//   };

//   const response = await axios.post('https://oracle.example.com/hcm/leaves', body, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.data;
// }


//test

async function createLeaveOracle(accessToken, universalLeave, userEmail) {
  const targetFields = ["Reason", "LeaveType", "type", "StartDate", "start", "EndDate", "end", "Status", "ApprovalStatus", "status"];
  const erpBody = {};

  for (const key in universalLeave) {
    const match = aiMatchField(key, targetFields);
    if (match && match.match) {
      erpBody[match.match] = universalLeave[key];
      console.log(`🧠 AI Mapped (Oracle): ${key} → ${match.match} (${match.confidence}%)`);
    }
  }

  erpBody.Status = erpBody.Status || "Submitted";

  const record = await Leave.create({ email: userEmail, provider: "oracle", payload: erpBody });
  return record.payload;
}

module.exports = { getLeavesOracle, createLeaveOracle };
