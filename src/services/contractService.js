const { Contract, Profile } = require('../models').models;

const getContractByIdService = async (profileId, contractId) => {
  try {
    const contract = await Contract.findOne({
      where: { id: contractId, [Contract.belongsTo(Profile, { as: 'Client' }).foreignKey]: profileId },
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
      where: {
        [Op.or]: [
          { [Contract.belongsTo(Profile, { as: 'Client' }).foreignKey]: profileId },
          { [Contract.belongsTo(Profile, { as: 'Contractor' }).foreignKey]: profileId },
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
