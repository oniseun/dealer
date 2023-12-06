const { depositMoneyService } = require('../services/balanceService');

const depositMoney = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    await depositMoneyService(userId, amount);

    res.json({ message: 'Deposit successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { depositMoney };
