const { getUnpaidJobsService, payForJobService } = require('./jobService');
const { models: { Job, Contract, Profile }, sequelize } = require('../models');

describe('contractService', () => {
// Mock Sequelize functions
jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const ProfileMock = dbMock.define('Profile', {
    id: 1,
    balance: 100.0,
  });

  const ContractMock = dbMock.define('Contract', {
    id: 1,
    status: 'in_progress',
  });

  const JobMock = dbMock.define('Job', {
    id: 1,
    paid: false,
    price: 20.0,
  });

  // Associations
  ProfileMock.hasMany(ContractMock, { foreignKey: 'ClientId' });
  ContractMock.belongsTo(ProfileMock, { as: 'Client' });
  ProfileMock.hasMany(ContractMock, { foreignKey: 'ContractorId' });
  ContractMock.belongsTo(ProfileMock, { as: 'Contractor' });
  ContractMock.hasMany(JobMock);
  JobMock.belongsTo(ContractMock);

  return {
    models: {
      Job: JobMock,
      Contract: ContractMock,
      Profile: ProfileMock,
    },
    sequelize: dbMock,
  };
});

describe('getUnpaidJobsService', () => {
  it('should retrieve unpaid jobs for a profile', async () => {
    const profileId = 1;

    // Mock data
    const unpaidJobsData = [
      {
        id: 1,
        paid: false,
        price: 20.0,
        Contract: {
          id: 1,
          status: 'in_progress',
        },
      },
    ];

    // Mock Sequelize findAll function
    Job.findAll = jest.fn().mockResolvedValue(unpaidJobsData);

    const unpaidJobs = await getUnpaidJobsService(profileId);

    expect(unpaidJobs).toEqual(unpaidJobsData);
    expect(Job.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: Contract,
          where: {
            [sequelize.Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            status: 'in_progress',
          },
        },
      ],
      where: {
        [sequelize.Op.or]: [{ paid: false }, { paid: { [sequelize.Op.is]: null } }],
      },
    });
  });

  it('should handle errors during retrieval', async () => {
    const profileId = 1;

    // Mock Sequelize findAll function to throw an error
    Job.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(getUnpaidJobsService(profileId)).rejects.toThrow('Error retrieving unpaid jobs');
  });
});

describe('payForJobService', () => {
  it('should process job payment successfully', async () => {
    const clientId = 1;
    const jobId = 1;

    // Mock data
    const jobData = {
      id: jobId,
      paid: false,
      price: 20.0,
      Contract: {
        id: 1,
        Contractor: {
          id: 2,
          balance: 80.0,
        },
      },
    };

    // Mock Sequelize findOne and update functions
    Job.findOne = jest.fn().mockResolvedValue(jobData);
    Profile.findOne = jest.fn().mockResolvedValue({
      id: clientId,
      balance: 50.0,
      update: jest.fn(),
    });

    // Mock Sequelize transaction functions
    sequelize.transaction = jest.fn().mockImplementation((callback) => callback());

    const paymentResult = await payForJobService(clientId, jobId);

    expect(paymentResult).toEqual({ message: 'Payment successful' });
    expect(Job.findOne).toHaveBeenCalledWith({
      where: {
        id: jobId,
        paid: {
          [sequelize.Op.or]: [false, null],
        },
      },
      include: [
        {
          model: Contract,
          include: [{ model: Profile, as: 'Contractor' }],
        },
      ],
    });
    expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
    expect(sequelize.transaction).toHaveBeenCalled();
    expect(Profile.findOne().update).toHaveBeenCalledWith({ balance: 30.0 });
    expect(Profile.findOne().update).toHaveBeenCalledWith({ balance: 100.0 });
    expect(Job.findOne().update).toHaveBeenCalledWith({
      paid: true,
      paymentDate: expect.any(Date),
    });
  });

  it('should handle insufficient funds', async () => {
    const clientId = 1;
    const jobId = 1;

    // Mock data with insufficient funds
    const jobData = {
      id: jobId,
      paid: false,
      price: 80.0, // Job price exceeds client's balance
      Contract: {
        id: 1,
        Contractor: {
          id: 2,
          balance: 80.0,
        },
      },
    };

    // Mock Sequelize findOne function
    Job.findOne = jest.fn().mockResolvedValue(jobData);

    await expect(payForJobService(clientId, jobId)).rejects.toThrow('Insufficient funds');
  });

  it('should handle errors during payment processing', async () => {
    const clientId = 1;
    const jobId = 1;

    // Mock Sequelize findOne function to throw an error
    Job.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(payForJobService(clientId, jobId)).rejects.toThrow('Error processing job payment');
  });
});

});