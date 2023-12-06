const { getUnpaidJobs, payForJob } = require('../../src/controllers/jobController');
const { getUnpaidJobsService, payForJobService } = require('../../src/services/jobService');

jest.mock('../../src/services/jobService');

describe('jobController', () => {
  describe('getUnpaidJobs', () => {
    it('should get unpaid jobs successfully', async () => {
      const unpaidJobs = [{ id: 1, /* other job properties */ }, /* other jobs */];

      getUnpaidJobsService.mockResolvedValue(unpaidJobs);

      const req = {
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getUnpaidJobs(req, res);

      expect(getUnpaidJobsService).toHaveBeenCalledWith(req.profile.id);
      expect(res.json).toHaveBeenCalledWith(unpaidJobs);
    });

    // ... (similar tests for other scenarios)
  });

  describe('payForJob', () => {
    it('should pay for job successfully', async () => {
      const job_id = '1';

      const req = {
        profile: { id: 1 }, // Assuming authenticated user's profile
        params: { job_id },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await payForJob(req, res);

      expect(payForJobService).toHaveBeenCalledWith(req.profile.id, job_id);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment successful' });
    });

    it('should return 400 for invalid input', async () => {
      const job_id = 'invalid-id';

      const req = {
        profile: { id: 1 }, // Assuming authenticated user's profile
        params: { job_id },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await payForJob(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Job ID must be a number.' });
    });

    // ... (similar tests for other scenarios)
  });
});
