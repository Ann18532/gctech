//switch to real ml model next
// Simulated embedding-based similarity scorer for demo purposes
const mockFieldVectors = {
    leave_reason: [0.1, 0.8, 0.3],
    leave_start: [0.5, 0.2, 0.6],
    leave_end: [0.4, 0.3, 0.7],
    status: [0.6, 0.7, 0.1]
  };
  
  const erpFieldVectors = {
    Reason: [0.11, 0.82, 0.29],
    LeaveType: [0.09, 0.79, 0.31],
    type: [0.15, 0.77, 0.34],
    StartDate: [0.51, 0.18, 0.62],
    EndDate: [0.42, 0.31, 0.73],
    Status: [0.62, 0.69, 0.12],
    ApprovalStatus: [0.58, 0.71, 0.09]
  };
  
  function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
  }
  
  function aiMatchField(universalField, erpFields = []) {
    const targetVec = mockFieldVectors[universalField];
    if (!targetVec) return null;
  
    let bestField = null;
    let bestScore = -1;
  
    for (const field of erpFields) {
      const erpVec = erpFieldVectors[field];
      if (!erpVec) continue;
      const score = cosineSimilarity(targetVec, erpVec);
      if (score > bestScore) {
        bestScore = score;
        bestField = field;
      }
    }
  
    return {
      match: bestField,
      confidence: Math.round(bestScore * 1000) / 10 // 1 decimal place
    };
  }
  
  module.exports = { aiMatchField };
  