const { Profile } = require('../models').models;

const depositMoneyService = async (userId, amount) => {
  try {
    // Ensure client can't deposit more than 25% of their total jobs to pay
    const client = await Profile.findOne({ where: { id: userId, type: 'client' } });
    const totalJobsToPay = await client.countJobs({ where: { paid: false } });
    const maxDepositAmount = 0.25 * totalJobsToPay;

    if (amount > maxDepositAmount) {
      throw new Error(`Deposit exceeds 25% of total jobs to pay: ${maxDepositAmount}`);
    }

    // Update client's balance
    await client.update({ balance: client.balance + amount });

    return { message: 'Deposit successful' };
  } catch (error) {
    console.error(error);
    throw new Error('Error processing deposit');
  }
};

module.exports = { depositMoneyService };
