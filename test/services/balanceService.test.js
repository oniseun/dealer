

const { depositMoneyService } = require('../../src/services/balanceService');
const { models: { Profile, Job, Contract } } = require('../../src/models');
const { Op } = require('sequelize');

// Mock Sequelize functions
jest.mock('../../src/models', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
  
    const ProfileMock = dbMock.define('Profile', {
      id: 1,
      type: 'client',
      balance: 100,
    });
  
    const ContractMock = dbMock.define('Contract', {
      id: 1,
      status: 'in_progress',
    });
  
    const JobMock = dbMock.define('Job', {
      price: 50,
    });
  
    // Associations
    ProfileMock.hasMany(ContractMock, { as: 'Client', foreignKey: 'ClientId' });
    ContractMock.belongsTo(ProfileMock, { as: 'Client' });
    ContractMock.hasMany(JobMock);
    JobMock.belongsTo(ContractMock);
  
    return {
      models: {
        Profile: ProfileMock,
        Contract: ContractMock,
        Job: JobMock,
      },
      sequelize: dbMock,
    };
  });

describe('balanceService', () => {

describe('depositMoneyService', () => {
  it('should deposit money into a client\'s account successfully', async () => {
    const userId = 1;
    const amount = 10;

    // Mock data
    const clientData = {
      id: userId,
      type: 'client',
      balance: 100,
      update: jest.fn().mockResolvedValue(true)
    };

    // Mock Sequelize findOne and sum functions
    Profile.findOne = jest.fn().mockResolvedValue(clientData);
    Job.sum = jest.fn().mockResolvedValue(50);
    const result = await depositMoneyService(userId, amount);

    expect(result).toEqual({ message: 'Deposit successful' });
    expect(Profile.findOne).toHaveBeenCalledWith({
      where: { id: userId, type: 'client' },
    });
    expect(Job.sum).toHaveBeenCalledWith('price', {
      where: {
        [Op.or]: [{paid: false}, {paid: {[Op.is]: null}}],
      },
      include: [
        {
          model: Contract,
          where: { status: 'in_progress' },
          include: [
            {
              model: Profile,
              as: 'Client',
              where: { id: userId },
            },
          ],
        },
      ],
    });
  });

  it('should handle errors during deposit', async () => {
    const userId = 1;
    const amount = 30;

    // Mock data
    const clientData = {
      id: userId,
      type: 'client',
      balance: 100,
    };

    // Mock Sequelize findOne function to throw an error
    Profile.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(depositMoneyService(userId, amount)).rejects.toThrow('Database error');
  });

  it('should handle deposit exceeding 25% of total jobs to pay', async () => {
    const userId = 1;
    const amount = 30;

    // Mock data
    const clientData = {
      id: userId,
      type: 'client',
      balance: 100,
      update: jest.fn().mockResolvedValue(true)
    };

    // Mock Sequelize findOne and sum functions
    Profile.findOne = jest.fn().mockResolvedValue(clientData);
    Job.sum = jest.fn().mockResolvedValue(50);

    await expect(depositMoneyService(userId, amount)).rejects.toThrow(new Error('Deposit exceeds 25% of total jobs to pay: 12.5'));
  });
});

});


