const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { depositMoney } = require('../controllers/balanceController');
const router = express.Router();
/**
 * @swagger
 * /balances/deposit/{userId}:
 *   post:
 *     summary: Deposit money into a client's balance
 *     description: Deposits money into the balance of a client. The client can't deposit more than 25% of their total jobs to pay at the deposit moment.
 *     tags:
 *       - Balances
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client for whom to deposit money
 *       - in: header
 *         name: profile_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the authenticated profile making the deposit
 *       - in: body
 *         name: body
 *         required: true
 *         description: Deposit details
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               format: double
 *               description: The amount to deposit
 *     responses:
 *       200:
 *         description: Successful deposit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Deposit successful
 *       400:
 *         description: Bad Request (e.g., exceeds deposit limit)
 *       401:
 *         description: Unauthorized (invalid profile_id)
 *       500:
 *         description: Internal Server Error
 */
router.post('/deposit/:userId', getProfile, depositMoney);


module.exports = router;
