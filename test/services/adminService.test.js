
const { getBestProfessionService, getBestClientsService } = require('../../src/services/adminService');
const { models: { Profile, Job, Contract }, sequelize } = require('../../src/models');
const { Op } = require('sequelize');


describe('adminService', () => {
  describe('getBestProfessionService', () => {
    it('should get the best profession', async () => {
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      
      // Spy on Sequelize findAll function
      const findAllSpy = jest.spyOn(Job, 'findAll').mockResolvedValue([
        {
          'Contract.Contractor.profession': 'Engineer',
          total: 150,
        }, 
      ]);

      const result = await getBestProfessionService(start, end);

      expect(result).toEqual({
        profession: 'Engineer',
        totalEarnings: 150,
      });
      expect(findAllSpy).toHaveBeenCalledWith({
        attributes: [
          [sequelize.fn('sum', sequelize.col('price')), 'total'],
        ],
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
        raw: true
      });
    });
  });

  describe('getBestClientsService', () => {
    it('should get the best clients', async () => {
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      const limit = 5;

      // Spy on Sequelize findAll function
      const jobsSpy = jest.spyOn(Job, 'findAll').mockResolvedValue([
        {
          id: 1,
          fullName: 'John Doe',
          paid: 150,
        },
      ]);

      const result = await getBestClientsService(start, end, limit);

      expect(result).toEqual([
        {
          id: 1,
          fullName: 'John Doe',
          paid: 150,
        },
      ]);
      expect(jobsSpy).toHaveBeenCalledWith({
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
      });
    });
  });
});
