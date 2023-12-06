const { Contract, Profile } = require('../models').models;
const { Op } = require('sequelize');

const getContractByIdService = async (profileId, contractId) => {
    try {
      const contract = await Contract.findOne({
        include: [
          {
            model: Profile,
            as: 'Client',
            attributes: [],
          },
        ],
        where: {
          id: contractId,
          '$Client.id$': profileId,
        },
      });
  
      return contract;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving contract by ID');
    }
  };
  
const getContractsService = async (profileId) => {
    try {
      const contracts = await Contract.findAll({
        include: [
          {
            model: Profile,
            as: 'Client',
            attributes: [],
          },
          {
            model: Profile,
            as: 'Contractor',
            attributes: [],
          },
        ],
        where: {
          [Op.or]: [
            { '$Client.id$': profileId },
            { '$Contractor.id$': profileId },
          ],
          status: { [Op.ne]: 'terminated' },
        },
      });
  
      return contracts;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving contracts');
    }
  };
  

module.exports = { getContractByIdService, getContractsService };
