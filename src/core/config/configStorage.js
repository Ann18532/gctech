// TEMP: In-memory store — replace with DB/file later
const userERPConfigs = {
    "savaliya_ad@cs.iitr.ac.in": {
      provider: "bamboohr",
      baseURL: "https://api.bamboohr.com",
      auth: {
        type: "Bearer",
        token: "mock-token"
      }
    }
  };
  
  function getConfigForUser(email) {
    return userERPConfigs[email];
  }
  
  module.exports = { getConfigForUser };
  