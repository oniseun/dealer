const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getContracts } = require('../controllers/contractController');
const router = express.Router();

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Get a contract by ID
 *     description: Retrieve a contract based on its ID. The contract should belong to the authenticated profile.
 *     tags:
 *       - Contracts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the contract
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
 *               $ref: '#/components/schemas/Contract'
 *       401:
 *         description: Unauthorized (the contract does not belong to the authenticated profile)
 *       404:
 *         description: Contract not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getProfile, getContractById);

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Get contracts for the authenticated profile
 *     description: Returns a list of contracts belonging to the authenticated profile. Only non-terminated contracts are included.
 *     tags:
 *       - Contracts
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
 *                 $ref: '#/components/schemas/Contract'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getProfile, getContracts);


module.exports = router;
