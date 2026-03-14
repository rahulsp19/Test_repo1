const express = require('express');
const db = require('./dummyDb');

const app = express();
app.use(express.json());

// BUG: Missing input validation and SQL injection
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // BAD: string interpolation in SQL
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
    
    db.query(query, (err, result) => {
        if(err) {
            // BAD: returning internal error details to client
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// MEMORY LEAK: interval never cleared
setInterval(() => {
  console.log('[MONITOR] Server heartbeat:', new Date().toISOString());
}, 5000);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
