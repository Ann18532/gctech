const axios = require('axios');
const querystring = require('querystring');

const CLIENT_ID = process.env.ORACLE_CLIENT_ID;
const CLIENT_SECRET = process.env.ORACLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.ORACLE_REDIRECT_URI;
const AUTH_URL = process.env.ORACLE_AUTH_URL || 'https://example.oracle.com/oauth2/v1/authorize';
const TOKEN_URL = process.env.ORACLE_TOKEN_URL || 'https://example.oracle.com/oauth2/v1/token';

function generateAuthURL(email) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'https://example.oracle.com/hcm/leaves.read https://example.oracle.com/hcm/leaves.write',
    state: email
  });
  return `${AUTH_URL}?${params.toString()}`;
}

//real

// async function exchangeCodeForToken(code) {
//   const body = querystring.stringify({
//     grant_type: 'authorization_code',
//     code,
//     redirect_uri: REDIRECT_URI,
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET
//   });

//   const res = await axios.post(TOKEN_URL, body, {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//   });

//   return res.data; // { access_token, refresh_token, ... }
// }


//test

async function exchangeCodeForToken(code) {
    return {
      access_token: "mock-access-token-xyz",
      refresh_token: "mock-refresh-token-abc"
    };
}

module.exports = { generateAuthURL, exchangeCodeForToken };
