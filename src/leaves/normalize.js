function normalizeLeaveResponse(rawLeaves, provider) {
  switch (provider) {
    case 'oracle':
      return rawLeaves.map(leave => ({
        leave_id: leave.LeaveId || leave.id || leave.requestId,
        leave_reason: leave.Reason || leave.leaveType,
        leave_start: leave.StartDate,
        leave_end: leave.EndDate,
        status: leave.Status || leave.approvalStatus
      }));
    case 'sap':
      return rawLeaves.map(leave => ({
        leave_id: leave.RequestID,
        leave_reason: leave.LeaveType,
        leave_start: leave.StartDate,
        leave_end: leave.EndDate,
        status: leave.ApprovalStatus
      }));
    case 'bamboohr':
      return rawLeaves.map(leave => ({
        leave_id: leave.id,
        leave_reason: leave.type,
        leave_start: leave.start,
        leave_end: leave.end,
        status: leave.status
      }));
    default:
      return [];
  }
}

module.exports = { normalizeLeaveResponse };
