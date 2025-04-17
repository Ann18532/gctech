const { aiMatchField } = require('../ai-tools/fieldMapper');

function normalizeLeaveResponse(rawLeaves, provider) {
  return rawLeaves.map(leave => {
    const keys = Object.keys(leave);

    const match_reason = aiMatchField("leave_reason", keys);
    const match_start = aiMatchField("leave_start", keys);
    const match_end = aiMatchField("leave_end", keys);
    const match_status = aiMatchField("status", keys);
    const match_name = aiMatchField("name", keys);
    const match_email = aiMatchField("email", keys);

    return {
      leave_id:
        leave.LeaveId || leave.RequestID || leave.id || leave.req_id || null,
      leave_reason: leave[match_reason?.match] || '',
      leave_start: leave[match_start?.match] || '',
      leave_end: leave[match_end?.match] || '',
      status: leave[match_status?.match] || '',
      name: leave[match_name?.match] || '',
      email: leave[match_email?.match] || ''
    };
  });
}

module.exports = { normalizeLeaveResponse };
