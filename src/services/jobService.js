const { models: { Job, Contract, Profile }, sequelize } = require('../models');
const { Op } = require('sequelize');

const getUnpaidJobsService = async (profileId) => {
    try {
      const unpaidJobs = await Job.findAll({
        include: [
            {
                model: Contract,
                where: {
                    [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],
                    status: 'in_progress',
                },
            },
        ],
        where: {
            [Op.or]: [{paid: false}, {paid: {[Op.is]: null}}],
        },
      });
  
      return unpaidJobs;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving unpaid jobs');
    }
  };
  
const payForJobService = async (clientId, job_id) => {
    try {
        const job = await Job.findOne({
          where: {
            id: job_id,
            paid: {
              [Op.or]: [false, null],
            },
          },
          include: [
            { model: Contract, include: [{ model: Profile, as: 'Contractor' }] },
          ],
        });
    
        if (!job) {
            throw new Error('Job not found');
        }
    
        const client = await Profile.findOne({ where: { id: clientId } });
        const contractor = job.Contract.Contractor;
    
        if (client.balance >= job.price) {
          const transaction = await sequelize.transaction();
          try {
            await client.update(
              { balance: client.balance - job.price },
              { transaction }
            );
            await contractor.update(
              { balance: contractor.balance + job.price },
              { transaction }
            );
            await job.update(
              { paid: true, paymentDate: new Date() },
              { transaction }
            );
            await transaction.commit();
    
            return { message: 'Payment successful' };
          } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new Error('Internal Server Error');
          }
        } else {
            throw new Error('Insufficient funds');
        }
      } catch (error) {
        console.error(error);
        throw new Error('Error processing job payment');
      }
  };
  
  

module.exports = { getUnpaidJobsService, payForJobService };
