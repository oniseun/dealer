const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getUnpaidJobs, payForJob } = require('../controllers/jobController');
const router = express.Router();

/**
 * @swagger
 * /jobs/unpaid:
 *   get:
 *     summary: Get unpaid jobs for the authenticated profile
 *     description: Returns a list of unpaid jobs for the authenticated profile within active contracts.
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: header
 *         name: profile_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the authenticated profile
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/unpaid', getProfile, getUnpaidJobs);



/**
 * @swagger
 * /jobs/{job_id}/pay:
 *   post:
 *     summary: Pay for a job
 *     description: Allows a client to pay for a job if their balance is sufficient. The amount is moved from the client's balance to the contractor's balance.
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job to pay for
 *       - in: header
 *         name: profile_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the authenticated profile (client)
 *     responses:
 *       200:
 *         description: Successful payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Payment successful
 *       400:
 *         description: Bad Request (e.g., insufficient balance)
 *       401:
 *         description: Unauthorized (invalid profile_id or not the client of the job)
 *       500:
 *         description: Internal Server Error
 */
router.post('/:job_id/pay', getProfile, payForJob);


module.exports = router;
