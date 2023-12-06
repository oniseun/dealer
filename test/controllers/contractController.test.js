const chai = require('chai');
const sinon = require('sinon');
const contractController = require('../../src/controllers/contractController');
const contractService = require('../../src/services/contractService');

const expect = chai.expect;

describe('Contract Controller Tests', () => {
  describe('getContractById', () => {
    it('should get a contract by ID', async () => {
      const req = { params: { id: 1 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const fakeContract = { id: 1, terms: 'Sample terms' };

      sinon.stub(contractService, 'getContractByIdService').resolves(fakeContract);

      await contractController.getContractById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeContract)).to.be.true;

      contractService.getContractByIdService.restore();
    });

    it('should handle contract not found', async () => {
      const req = { params: { id: 2 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(contractService, 'getContractByIdService').resolves(null);

      await contractController.getContractById(req, res);

      expect(res.status.calledWith(404)).to.be.true;

      contractService.getContractByIdService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { params: { id: 1 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(contractService, 'getContractByIdService').throws(new Error('Test Error'));

      await contractController.getContractById(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      contractService.getContractByIdService.restore();
    });
  });

  describe('getContracts', () => {
    it('should get contracts for a user', async () => {
      const req = { profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const fakeContracts = [{ id: 1, terms: 'Sample terms' }];

      sinon.stub(contractService, 'getContractsService').resolves(fakeContracts);

      await contractController.getContracts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeContracts)).to.be.true;

      contractService.getContractsService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(contractService, 'getContractsService').throws(new Error('Test Error'));

      await contractController.getContracts(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      contractService.getContractsService.restore();
    });
  });
});
