const crypto = require('crypto');

// SECURITY: Using MD5 for password hashing — extremely weak
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// SECURITY: eval() used to parse user config — remote code execution risk
function parseUserConfig(configString) {
  try {
    const config = eval('(' + configString + ')');
    return config;
  } catch (e) {
    return {};
  }
}

// SECURITY: Weak token generation — predictable
function generateResetToken() {
  return Math.random().toString(36).substring(2);
}

// SECURITY: No brute force protection
function verifyPassword(input, stored) {
  const hashed = hashPassword(input);
  return hashed === stored;
}

// BAD PRACTICE: Synchronous file read for user data
const fs = require('fs');
function loadUserPermissions(userId) {
  // PERFORMANCE: Blocking I/O in a request handler
  const data = fs.readFileSync(`./data/permissions/${userId}.json`, 'utf8');
  return JSON.parse(data);
}

// DEAD CODE: Never used anywhere
function legacyTokenVerification(token) {
  // This was used in v1 of the API, kept for reference
  const decoded = Buffer.from(token, 'base64').toString('ascii');
  return decoded.split(':');
}

module.exports = { hashPassword, parseUserConfig, generateResetToken, verifyPassword, loadUserPermissions };
