const { Profile, Job, Contract } = require('../models').models;

const depositMoneyService = async (userId, amount) => {
    try {
      const client = await Profile.findOne({ where: { id: userId, type: 'client' } });
  
      if (!client) {
        throw new Error(`Client with ID ${userId} not found`);
      }
  
      const unpaidJobs = await Job.sum('price', {
        where: {
            paid: null
        },
        include: [
            {
                model: Contract,
                where: { status: 'in_progress' },
                include: [
                    {
                        model: Profile,
                        as: 'Client',
                        where: { id: userId }
                    }
                ]
            }
        ]
    });
  
      const maxDepositAmount = 0.25 * unpaidJobs;
  
      if (amount > maxDepositAmount) {
        throw new Error(`Deposit exceeds 25% of total jobs to pay: ${maxDepositAmount}`);
      }
  
      // Update client's balance
      await client.update({ balance: client.balance + amount });
  
      return { message: 'Deposit successful' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

module.exports = { depositMoneyService };
