const chai = require('chai');
const sinon = require('sinon');
const contractService = require('../../src/services/contractService');
const { Contract, Profile, Job } = require('../../src/models').models;

const expect = chai.expect;

describe('Contract Service Tests', () => {
  describe('getContractByIdService', () => {
    it('should get a contract by ID', async () => {
      const fakeContract = { id: 1, terms: 'Sample terms' };
      sinon.stub(Contract, 'findOne').resolves(fakeContract);

      const result = await contractService.getContractByIdService(1, 1);

      expect(result).to.deep.equal(fakeContract);

      Contract.findOne.restore();
    });

    it('should return null for non-existent contract', async () => {
      sinon.stub(Contract, 'findOne').resolves(null);

      const result = await contractService.getContractByIdService(2, 1);

      expect(result).to.be.null;

      Contract.findOne.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Contract, 'findOne').throws(new Error('Test Error'));

      try {
        await contractService.getContractByIdService(1, 1);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Contract.findOne.restore();
    });
  });

  describe('getContractsService', () => {
    it('should get contracts for a user', async () => {
      const fakeContracts = [{ id: 1, terms: 'Sample terms' }];
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client' });
      sinon.stub(Contract, 'findAll').resolves(fakeContracts);

      const result = await contractService.getContractsService(1);

      expect(result).to.deep.equal(fakeContracts);

      Profile.findOne.restore();
      Contract.findAll.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client' });
      sinon.stub(Contract, 'findAll').throws(new Error('Test Error'));

      try {
        await contractService.getContractsService(1);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Profile.findOne.restore();
      Contract.findAll.restore();
    });
  });
});
