const chai = require('chai');
const sinon = require('sinon');
const jobController = require('../../src/controllers/jobController');
const jobService = require('../../src/services/jobService');

const expect = chai.expect;

describe('Job Controller Tests', () => {
  describe('getUnpaidJobs', () => {
    it('should get unpaid jobs for a user', async () => {
      const req = { profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const fakeUnpaidJobs = [{ id: 1, description: 'Sample job', price: 100, paid: false }];

      sinon.stub(jobService, 'getUnpaidJobsService').resolves(fakeUnpaidJobs);

      await jobController.getUnpaidJobs(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeUnpaidJobs)).to.be.true;

      jobService.getUnpaidJobsService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(jobService, 'getUnpaidJobsService').throws(new Error('Test Error'));

      await jobController.getUnpaidJobs(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      jobService.getUnpaidJobsService.restore();
    });
  });

  describe('payForJob', () => {
    it('should pay for a job', async () => {
      const req = { params: { job_id: 1 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(jobService, 'payForJobService').resolves({ message: 'Payment successful' });

      await jobController.payForJob(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Payment successful' })).to.be.true;

      jobService.payForJobService.restore();
    });

    it('should handle errors and return 500 status', async () => {
      const req = { params: { job_id: 1 }, profile: { id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(jobService, 'payForJobService').throws(new Error('Test Error'));

      await jobController.payForJob(req, res);

      expect(res.status.calledWith(500)).to.be.true;

      jobService.payForJobService.restore();
    });
  });
});
