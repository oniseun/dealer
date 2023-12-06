const { depositMoneyService } = require('../services/balanceService');

const depositMoney = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  // Validate input
  if (!userId || isNaN(Number(userId)) || !amount || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Invalid input. Both userId and amount are required, and userId must be a number, amount must be a decimal or number.' });
  }

  try {
    await depositMoneyService(userId, amount);

    res.json({ message: 'Deposit successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { depositMoney };
