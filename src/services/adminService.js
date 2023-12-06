const { Profile, Job, Contract } = require('../models').models;
const { Op } = require('sequelize');

const getBestProfessionService = async (start, end) => {
  try {
    const bestProfession = await Profile.findAll({
      attributes: ['profession', [sequelize.fn('sum', sequelize.col('Jobs.price')), 'totalEarnings']],
      include: [
        {
          model: Contract,
          where: {
            status: 'terminated',
            paymentDate: { [Op.between]: [start, end] },
          },
          include: [Job],
        },
      ],
      group: ['Profile.profession'],
      order: [[sequelize.fn('sum', sequelize.col('Jobs.price')), 'DESC']],
      limit: 1,
    });

    if (!bestProfession || bestProfession.length === 0) throw new Error('No data found');

    return { profession: bestProfession[0].profession, totalEarnings: bestProfession[0].totalEarnings };
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving best profession');
  }
};

const getBestClientsService = async (start, end, limit) => {
  try {
    const bestClients = await Profile.findAll({
      attributes: ['id', 'fullName', [sequelize.fn('sum', sequelize.col('Jobs.price')), 'paid']],
      include: [
        {
          model: Contract,
          where: {
            status: 'terminated',
            paymentDate: { [Op.between]: [start, end] },
          },
          include: [Job],
        },
      ],
      group: ['Profile.id'],
      order: [[sequelize.fn('sum', sequelize.col('Jobs.price')), 'DESC']],
      limit: parseInt(limit),
    });

    return bestClients;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving best clients');
  }
};

module.exports = { getBestProfessionService, getBestClientsService };
