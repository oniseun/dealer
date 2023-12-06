const { models: { Profile, Job, Contract } , sequelize } = require('../models');
const { Op } = require('sequelize');

const getBestProfessionService = async (start, end) => {
    try {
      const bestProfession = await Job.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('price')), 'total']],
        limit: 1,
        group: ['Contract.Contractor.profession'],
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        include: [
          {
            attributes: ['createdAt'],
            include: [{
              attributes: ['profession'], as: 'Contractor', model: Profile, where: { type: 'contractor' },
            }],
            model: Contract,
          },
        ],
        where: { paid: true, createdAt: { [Op.between]: [start, end] } },
      });
  
      if (!bestProfession || bestProfession.length === 0) {
        throw new Error('No data found');
      }
      
        const best = bestProfession.shift().get({ plain: true });

      return {
        profession: best.Contract.Contractor.profession,
        totalEarnings: best.total,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving best profession');
    }
  };


  const getBestClientsService = async (start, end, limit) => {
    try {
      const bestClients = await Job.findAll({
        where: {
          paid: 1,
          "paymentDate": {[Op.between] : [start , end]} 
        },
        attributes: [
            "Contract.Client.id",
            [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
            [sequelize.fn('sum', sequelize.col('price')), 'paid'],
        ],
        order: [[sequelize.col('paid'), 'DESC']],
        include: [{
          model: Contract,
          attributes: {exclude: ['id', 'terms', 'status', 'ContractorId', 'ClientId','createdAt', 'updatedAt']},
          include: [{
            model: Profile,
            as: 'Client',
            attributes: {exclude: ['id', 'firstName', 'lastName', 'profession', 'balance', 'type', 'createdAt', 'updatedAt']},
            where: { type: 'client'}
          }],
        }],
        group: ["Contract->Client.firstName"],
        limit: parseInt(limit),
        raw: true,
      })
  
      return bestClients;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving best clients');
    }
  };

module.exports = { getBestProfessionService, getBestClientsService };
