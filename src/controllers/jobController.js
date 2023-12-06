const { getUnpaidJobsService, payForJobService } = require('../services/jobService');

const getUnpaidJobs = async (req, res) => {
  try {
    const unpaidJobs = await getUnpaidJobsService(req.profile.id);

    res.json(unpaidJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const payForJob = async (req, res) => {
  const { job_id } = req.params;

  try {
    await payForJobService(req.profile.id, job_id);

    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getUnpaidJobs, payForJob };
