// This mocks a third-party API call
async function fetchEmployeesFromBambooHR(config) {
    // Simulated third-party employee data
    return [
      {
        id: "EMP001",
        firstName: "Ash",
        lastName: "Ketchum",
        jobTitle: "Trainer",
        workEmail: "ash@pallet.com",
        hireDate: "1997-04-01"
      },
      {
        id: "EMP002",
        firstName: "Misty",
        lastName: "Waterflower",
        jobTitle: "Gym Leader",
        workEmail: "misty@cerulean.com",
        hireDate: "1998-02-14"
      }
    ];
  }
  
  module.exports = { fetchEmployeesFromBambooHR };
  