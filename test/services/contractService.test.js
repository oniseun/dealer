const { getContractByIdService, getContractsService } = require('../../src/services/contractService');
const { models: { Contract, Profile }, sequelize } = require('../../src/models');
const { Op } = require('sequelize');


// Mock Sequelize functions
jest.mock('../../src/models', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
  
    const ProfileMock = dbMock.define('Profile', {
      id: 1,
    });
  
    const ContractMock = dbMock.define('Contract', {
      id: 1,
      status: 'in_progress',
    });
  
    // Associations
    ProfileMock.hasMany(ContractMock, { as: 'Client', foreignKey: 'ClientId' });
    ContractMock.belongsTo(ProfileMock, { as: 'Client' });
    ProfileMock.hasMany(ContractMock, { as: 'Contractor', foreignKey: 'ContractorId' });
    ContractMock.belongsTo(ProfileMock, { as: 'Contractor' });
  
    return {
      models: {
        Contract: ContractMock,
        Profile: ProfileMock,
      },
      sequelize: dbMock,
    };
  });

describe('contractService', () => {
  
  describe('getContractByIdService', () => {
    it('should retrieve a contract by ID for a profile', async () => {
      const profileId = 1;
      const contractId = 1;
  
      // Mock data
      const contractData = {
        id: contractId,
        status: 'in_progress',
        Client: {
          id: profileId,
        },
      };
  
      // Mock Sequelize findOne function
      Contract.findOne = jest.fn().mockResolvedValue(contractData);
  
      const contract = await getContractByIdService(profileId, contractId);
  
      expect(contract).toEqual(contractData);
      expect(Contract.findOne).toHaveBeenCalledWith({
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
    });
  
    it('should handle errors during retrieval by ID', async () => {
      const profileId = 1;
      const contractId = 1;
  
      // Mock Sequelize findOne function to throw an error
      Contract.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
  
      await expect(getContractByIdService(profileId, contractId)).rejects.toThrow('Error retrieving contract by ID');
    });
  });
  
  describe('getContractsService', () => {
    it('should retrieve contracts for a profile', async () => {
      const profileId = 1;
  
      // Mock data
      const contractsData = [
        {
          id: 1,
          status: 'in_progress',
          Client: {
            id: profileId,
          },
          Contractor: {
            id: 2,
          },
        },
      ];
  
      // Mock Sequelize findAll function
      Contract.findAll = jest.fn().mockResolvedValue(contractsData);
  
      const contracts = await getContractsService(profileId);
  
      expect(contracts).toEqual(contractsData);
      expect(Contract.findAll).toHaveBeenCalledWith({
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
    });
  
    it('should handle errors during retrieval of contracts', async () => {
      const profileId = 1;
  
      // Mock Sequelize findAll function to throw an error
      Contract.findAll = jest.fn().mockRejectedValue(new Error('Database error'));
  
      await expect(getContractsService(profileId)).rejects.toThrow('Error retrieving contracts');
    });
  });
});
