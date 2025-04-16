// File: src/integration/sapOAuth.js
const CLIENT_ID = "mock-sap-client";
const REDIRECT_URI = "http://localhost:3000/api/integration/callback/sap";
const AUTH_URL = "https://sap.example.com/oauth2/authorize"; // mocked

function generateAuthURL(email) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'https://sap.example.com/api/leaves.read https://sap.example.com/api/leaves.write',
    state: email
  });

  return `${AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  return {
    access_token: `mock-access-token-sap-${code}`,
    refresh_token: `mock-refresh-token-sap-${code}`
  };
}

module.exports = { generateAuthURL, exchangeCodeForToken };
