//ai/ml here for data mapping and normalization

function normalizeEmployee(raw) {
    return {
      employeeId: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.workEmail,
      jobTitle: raw.jobTitle,
      startDate: raw.hireDate
    };
  }
  
  function normalizeEmployeeList(rawList) {
    return rawList.map(normalizeEmployee);
  }
  
  module.exports = { normalizeEmployeeList };
  