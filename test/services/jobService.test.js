const chai = require('chai');
const sinon = require('sinon');
const jobService = require('../../src/services/jobService');
const { Contract, Job, Profile } = require('../../src/models').models;

const expect = chai.expect;

describe('Job Service Tests', () => {
  describe('getUnpaidJobsService', () => {
    it('should get unpaid jobs for a user', async () => {
      const fakeUnpaidJobs = [{ id: 1, description: 'Sample job', price: 100, paid: false }];
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client' });
      sinon.stub(Contract, 'findAll').resolves([{ id: 1 }]);
      sinon.stub(Job, 'findAll').resolves(fakeUnpaidJobs);

      const result = await jobService.getUnpaidJobsService(1);

      expect(result).to.deep.equal(fakeUnpaidJobs);

      Profile.findOne.restore();
      Contract.findAll.restore();
      Job.findAll.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client' });
      sinon.stub(Contract, 'findAll').resolves([{ id: 1 }]);
      sinon.stub(Job, 'findAll').throws(new Error('Test Error'));

      try {
        await jobService.getUnpaidJobsService(1);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Profile.findOne.restore();
      Contract.findAll.restore();
      Job.findAll.restore();
    });
  });

  describe('payForJobService', () => {
    it('should pay for a job', async () => {
      const fakeJob = { id: 1, description: 'Sample job', price: 100, paid: false };
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client' });
      sinon.stub(Job, 'findOne').resolves(fakeJob);

      const result = await jobService.payForJobService(1, 1);

      expect(result.message).to.equal('Payment successful');

      Profile.findOne.restore();
      Job.findOne.restore();
    });

    it('should handle insufficient balance', async () => {
      const fakeJob = { id: 1, description: 'Sample job', price: 100, paid: false };
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client', balance: 50 });
      sinon.stub(Job, 'findOne').resolves(fakeJob);

      try {
        await jobService.payForJobService(1, 1);
      } catch (error) {
        expect(error.message).to.equal('Insufficient balance');
      }

      Profile.findOne.restore();
      Job.findOne.restore();
    });

    it('should handle job already paid', async () => {
      const fakeJob = { id: 1, description: 'Sample job', price: 100, paid: true };
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client', balance: 150 });
      sinon.stub(Job, 'findOne').resolves(fakeJob);

      try {
        await jobService.payForJobService(1, 1);
      } catch (error) {
        expect(error.message).to.equal('Job already paid');
      }

      Profile.findOne.restore();
      Job.findOne.restore();
    });

    it('should throw an error on database error', async () => {
      sinon.stub(Profile, 'findOne').resolves({ id: 1, type: 'client', balance: 150 });
      sinon.stub(Job, 'findOne').throws(new Error('Test Error'));

      try {
        await jobService.payForJobService(1, 1);
      } catch (error) {
        expect(error.message).to.equal('Test Error');
      }

      Profile.findOne.restore();
      Job.findOne.restore();
    });
  });
});
