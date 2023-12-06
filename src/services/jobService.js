const { Job, Contract } = require('../models').models;

const getUnpaidJobsService = async (profileId) => {
  try {
    const unpaidJobs = await Job.findAll({
      where: {
        paid: false,
        paymentDate: null,
        [Op.and]: [
          { [Job.belongsTo(Contract).foreignKey]: { [Op.not]: null } },
          { [Contract.belongsTo(Profile, { as: 'Client' }).foreignKey]: profileId },
        ],
      },
      include: [{ model: Contract, where: { status: 'in_progress' } }],
    });

    return unpaidJobs;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving unpaid jobs');
  }
};

const payForJobService = async (jobId) => {
  try {
    const job = await Job.findOne({
      where: { id: jobId, paid: false, paymentDate: null },
      include: [{ model: Contract, include: [Profile] }],
    });

    if (!job) throw new Error('Job not found');

    const client = job.Contract.Client;
    const contractor = job.Contract.Contractor;

    if (client.balance < job.price) throw new Error('Insufficient funds');

    // Update balances
    await client.update({ balance: client.balance - job.price });
    await contractor.update({ balance: contractor.balance + job.price });

    // Mark job as paid
    await job.update({ paid: true, paymentDate: new Date() });

    return { message: 'Payment successful' };
  } catch (error) {
    console.error(error);
    throw new Error('Error processing job payment');
  }
};

module.exports = { getUnpaidJobsService, payForJobService };
