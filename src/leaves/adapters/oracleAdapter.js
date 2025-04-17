// File: src/leaves/adapters/oracleAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const Leave = require('../leaveModel');
const { OracleLeave } = require('../../integration/integrationModel');

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
  const records = await OracleLeave.find({ email: userEmail, provider: "oracle" });
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

  const record = await OracleLeave.create({ email: userEmail, provider: "oracle", payload: erpBody });
  return record.payload;
}

module.exports = { getLeavesOracle, createLeaveOracle };
