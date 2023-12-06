const chai = require('chai');
const sinon = require('sinon');
const adminController = require('../../src/controllers/adminController');
const adminService = require('../../src/services/adminService');

const expect = chai.expect;

describe('Admin Controller Tests', () => {
  describe('getBestProfession', () => {
    it('should return the best profession', async () => {
      const req = { query: { start: '2023-01-01', end: '2023-12-31' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const fakeBestProfession = { profession: 'Developer', totalEarnings: 5000 };

      sinon.stub(adminService, 'getBestProfessionService').resolves(fakeBestProfession);

      await adminController.getBestProfession(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeBestProfession)).to.be.true;

      adminService.getBestProfessionService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { query: { start: '2023-01-01', end: '2023-12-31' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(adminService, 'getBestProfessionService').throws(new Error('Test Error'));

      await adminController.getBestProfession(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      adminService.getBestProfessionService.restore();
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients', async () => {
      const req = { query: { start: '2023-01-01', end: '2023-12-31', limit: 2 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const fakeBestClients = [
        { id: 1, fullName: 'John Doe', paid: 2000 },
        { id: 2, fullName: 'Jane Doe', paid: 1500 },
      ];

      sinon.stub(adminService, 'getBestClientsService').resolves(fakeBestClients);

      await adminController.getBestClients(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeBestClients)).to.be.true;

      adminService.getBestClientsService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { query: { start: '2023-01-01', end: '2023-12-31', limit: 2 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(adminService, 'getBestClientsService').throws(new Error('Test Error'));

      await adminController.getBestClients(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      adminService.getBestClientsService.restore();
    });
  });
});
