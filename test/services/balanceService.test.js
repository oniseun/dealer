const chai = require('chai');
const sinon = require('sinon');
const balanceService = require('../../src/services/balanceService');
const { Profile } = require('../../src/models').models;

const expect = chai.expect;

describe('Balance Service Tests', () => {
  describe('depositMoneyService', () => {
    it('should deposit money for a user', async () => {
      const fakeProfile = { id: 1, balance: 100 };
      sinon.stub(Profile, 'findOne').resolves(fakeProfile);
      sinon.stub(Profile, 'update').resolves([1]);

      const result = await balanceService.depositMoneyService(1, 50);

      expect(result.message).to.equal('Deposit successful');

      Profile.findOne.restore();
      Profile.update.restore();
    });

    it('should handle exceeding deposit limit', async () => {
      const fakeProfile = { id: 1, balance: 100, type: 'client' };
      sinon.stub(Profile, 'findOne').resolves(fakeProfile);

      try {
        await balanceService.depositMoneyService(1, 30);
      } catch (error) {
        expect(error.message).to.equal('Exceeds deposit limit');
      }

      Profile.findOne.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Profile, 'findOne').throws(new Error('Test Error'));

      try {
        await balanceService.depositMoneyService(1, 50);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Profile.findOne.restore();
    });
  });
});
