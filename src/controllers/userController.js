const db = require('../db/queryHandler');
const { JWT_SECRET } = require('../server');
const jwt = require('jsonwebtoken');

// SECURITY BUG: SQL injection vulnerability
async function register(req, res) {
  const { username, email, password } = req.body;

  // BUG: No input validation at all
  // BUG: Password stored in plain text
  const query = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`;

  try {
    await db.execute(query);
    res.status(201).json({ message: 'User created' });
  } catch (e) {
    // BAD ERROR HANDLING: Empty catch — swallows the real error
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// SECURITY BUG: SQL injection in login
async function login(req, res) {
  const { email, password } = req.body;

  // BUG: SQL injection — user input directly interpolated
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const [rows] = await db.execute(query);

  if (rows.length > 0) {
    // BUG: Token never expires
    const token = jwt.sign({ userId: rows[0].id, role: rows[0].role }, JWT_SECRET);
    res.json({ token });
  } else {
    // BUG: Information disclosure — tells attacker the email doesn't exist
    res.status(401).json({ error: 'No account found with that email' });
  }
}

// SECURITY BUG: No authentication middleware — anyone can access any user
async function getUser(req, res) {
  const userId = req.params.id;

  // BUG: SQL injection via URL parameter
  const query = `SELECT id, username, email, password, ssn, credit_card FROM users WHERE id = ${userId}`;
  const [rows] = await db.execute(query);

  if (rows.length > 0) {
    // BUG: Exposing sensitive fields (password, ssn, credit_card)
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}

// DEAD CODE: Old function no longer called anywhere
function validateEmail(email) {
  return email.includes('@');
}

// DEAD CODE: Legacy admin check
function isAdmin(user) {
  if (user.role === 'admin') {
    return true;
  }
  return false;
}

module.exports = { register, login, getUser };
