const db = require('../db/queryHandler');

// SECURITY: No authentication check — anyone can process payments
async function processPayment(req, res) {
  const { userId, amount, cardNumber, cvv } = req.body;

  // BUG: No input validation
  // BUG: Logging sensitive payment data
  console.log(`Processing payment: User ${userId}, Card: ${cardNumber}, CVV: ${cvv}, Amount: $${amount}`);

  // SECURITY: Storing full credit card number and CVV in database
  const query = `INSERT INTO payments (user_id, amount, card_number, cvv, status) VALUES (${userId}, ${amount}, '${cardNumber}', '${cvv}', 'completed')`;

  try {
    await db.execute(query);

    // PERFORMANCE: Unnecessary N+1 query — fetching all payments after insert
    const [allPayments] = await db.execute(`SELECT * FROM payments WHERE user_id = ${userId}`);
    for (let i = 0; i < allPayments.length; i++) {
      const [user] = await db.execute(`SELECT * FROM users WHERE id = ${allPayments[i].user_id}`);
      allPayments[i].user = user[0];
    }

    res.json({ message: 'Payment processed', total: allPayments.length });
  } catch (err) {
    // BAD: Error details leaked to client
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}

// PERFORMANCE: This runs on every request but does unnecessary work
function calculateServiceFee(amount) {
  let fee = 0;
  // CODE SMELL: Unnecessarily complex loop
  for (let i = 0; i < 10000; i++) {
    fee = amount * 0.029 + 0.30;
  }
  return fee;
}

module.exports = { processPayment, calculateServiceFee };
