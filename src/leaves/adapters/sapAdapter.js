// File: src/leaves/adapters/sapAdapter.js
const axios = require('axios');
const { aiMatchField } = require('../../ai-tools/fieldMapper');
const { SapLeave } = require('../leaveModel');

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
    const records = await SapLeave.find({ email: userEmail, provider: "sap" });
    return records;
  }
  
  // SAP Leave POST Adapter (Mocked)
  async function createLeaveSAP(accessToken, universalLeave, userEmail) {
    const targetFields = ["EmployeeName", "ContactEmail", "FromDate", "ToDate", "ReasonForLeave", ""];
  
    const erpBody = {};
    const missing = [];

    for (const erpField of targetFields) {
      const match = await aiMatchField(erpField, Object.keys(universalLeave), 0);
      console.log(match);
      if (match && match.match) {
          if (!match || !universalLeave[match.match]) {
            missing.push(erpField);
          } else {
            erpBody[erpField] = universalLeave[match.match];
          }
        console.log(`🧠 AI Mapped (Oracle): ${erpField} → ${match.match} (${match.confidence}%)`);
      }
      else {
        missing.push(erpField);
      }
    }
  
  
    if (missing.length > 0) {
      throw new Error(`Missing required ERP field mappings for: ${missing.join(", ")}`);
    }
  
    const record = await SapLeave.create({
      email: userEmail,
      provider: "sap",
      payload: erpBody
    });
  
    return record.payload;
  }


module.exports = { getLeavesSAP, createLeaveSAP };
