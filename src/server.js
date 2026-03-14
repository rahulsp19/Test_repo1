const express = require('express');
const userController = require('./controllers/userController');
const paymentService = require('./services/paymentService');

const app = express();
app.use(express.json());

// BUG: No rate limiting on any endpoints
// BUG: No CORS configuration
// BUG: No helmet security headers

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);
app.get('/api/users/:id', userController.getUser);
app.post('/api/payments', paymentService.processPayment);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// BUG: Hardcoded secret in source code
const JWT_SECRET = 'super_secret_key_12345';
const DB_PASSWORD = 'admin123';

// MEMORY LEAK: interval never cleared
setInterval(() => {
  console.log('[MONITOR] Server heartbeat:', new Date().toISOString());
}, 5000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, JWT_SECRET };
