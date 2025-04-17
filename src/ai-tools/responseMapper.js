const { aiMatchField } = require('./fieldMapper');


async function aiNormalizeResponse(pl) {
  const normalized = {};
  const erpFields = Object.keys(pl.payload);
    console.log(erpFields);

    for (const field of erpFields) {
        const match = await aiMatchField(field); // erpField → universalField
        console.log(match);
    if (match && match.match) {
      normalized[match.match] = pl.payload[field];
      console.log(`🔁 AI Reverse Map: ${field} → ${match.match} (${match.confidence}%)`);
    } else {
      console.log(`⚠️ No universal match for ERP field: ${field}`);
    }
  }

  return normalized;
}

module.exports = { aiNormalizeResponse };
