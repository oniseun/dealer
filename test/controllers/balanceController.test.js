const chai = require('chai');
const sinon = require('sinon');
const balanceController = require('../../src/controllers/balanceController');
const balanceService = require('../../src/services/balanceService');

const expect = chai.expect;

describe('Balance Controller Tests', () => {
  describe('depositMoney', () => {
    it('should deposit money for a user', async () => {
      const req = { params: { userId: 1 }, body: { amount: 50 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(balanceService, 'depositMoneyService').resolves({ message: 'Deposit successful' });

      await balanceController.depositMoney(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Deposit successful' })).to.be.true;

      balanceService.depositMoneyService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { params: { userId: 1 }, body: { amount: 50 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(balanceService, 'depositMoneyService').throws(new Error('Test Error'));

      await balanceController.depositMoney(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      balanceService.depositMoneyService.restore();
    });
  });
});
