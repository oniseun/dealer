const chai = require('chai');
const sinon = require('sinon');
const adminService = require('../../src/services/adminService');
const { models : { Contract, Profile, Job }, sequelize } = require('../../src/models');

const expect = chai.expect;

describe('Admin Service Tests', () => {
  describe('getBestProfessionService', () => {
    it('should get the best profession', async () => {
      const fakeResults = [
        { profession: 'Developer', totalEarnings: 5000 },
        { profession: 'Designer', totalEarnings: 3000 },
      ];
      sinon.stub(Job, 'findAll').resolves(fakeResults);

      const result = await adminService.getBestProfessionService('2023-01-01', '2023-12-31');

      expect(result).to.deep.equal({ profession: 'Developer', totalEarnings: 5000 });

      Job.findAll.restore();
    });

    it('should handle no results', async () => {
      sinon.stub(Job, 'findAll').resolves([]);

      const result = await adminService.getBestProfessionService('2023-01-01', '2023-12-31');

      expect(result).to.be.null;

      Job.findAll.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Job, 'findAll').throws(new Error('Test Error'));

      try {
        await adminService.getBestProfessionService('2023-01-01', '2023-12-31');
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Job.findAll.restore();
    });
  });

  describe('getBestClientsService', () => {
    it('should get the best clients', async () => {
      const fakeResults = [
        { id: 1, fullName: 'John Doe', paid: 2000 },
        { id: 2, fullName: 'Jane Doe', paid: 1500 },
      ];
      sinon.stub(Profile, 'findAll').resolves(fakeResults);

      const result = await adminService.getBestClientsService('2023-01-01', '2023-12-31', 2);

      expect(result).to.deep.equal(fakeResults);

      Profile.findAll.restore();
    });

    it('should handle no results', async () => {
      sinon.stub(Profile, 'findAll').resolves([]);

      const result = await adminService.getBestClientsService('2023-01-01', '2023-12-31', 2);

      expect(result).to.deep.equal([]);

      Profile.findAll.restore();
    });

    it('should handle less results than the limit', async () => {
      const fakeResults = [
        { id: 1, fullName: 'John Doe', paid: 2000 },
        { id: 2, fullName: 'Jane Doe', paid: 1500 },
      ];
      sinon.stub(Profile, 'findAll').resolves(fakeResults);

      const result = await adminService.getBestClientsService('2023-01-01', '2023-12-31', 5);

      expect(result).to.deep.equal(fakeResults);

      Profile.findAll.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Profile, 'findAll').throws(new Error('Test Error'));

      try {
        await adminService.getBestClientsService('2023-01-01', '2023-12-31', 2);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Profile.findAll.restore();
    });
  });
});
