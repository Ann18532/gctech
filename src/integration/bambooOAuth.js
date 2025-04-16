// File: src/integration/bambooOAuth.js
const CLIENT_ID = "mock-bamboo-client";
const REDIRECT_URI = "http://localhost:3000/api/integration/callback/bamboohr";
const AUTH_URL = "https://bamboohr.example.com/oauth2/authorize"; // mocked

function generateAuthURL(email) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'https://bamboohr.example.com/api/time_off.read https://bamboohr.example.com/api/time_off.write',
    state: email
  });

  return `${AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  return {
    access_token: `mock-access-token-bamboo-${code}`,
    refresh_token: `mock-refresh-token-bamboo-${code}`
  };
}

module.exports = { generateAuthURL, exchangeCodeForToken };
