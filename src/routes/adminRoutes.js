const express = require('express');
const { getBestProfession, getBestClients } = require('../controllers/adminController');
const router = express.Router();

/**
 * @swagger
 * /admin/best-profession:
 *   get:
 *     summary: Get the best profession
 *     description: Returns the best profession based on earnings within a specified time range.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the time range
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the time range
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profession:
 *                   type: string
 *                   description: The best profession
 *                 totalEarnings:
 *                   type: number
 *                   format: double
 *                   description: Total earnings for the best profession
 *       500:
 *         description: Internal Server Error
 */
router.get('/best-profession', getBestProfession);

/**
 * @swagger
 * /admin/best-clients:
 *   get:
 *     summary: Get the best clients
 *     description: Returns the clients who paid the most for jobs within a specified time range.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the time range
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the time range
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Limit the number of clients to return (default is 2)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The client's ID
 *                   fullName:
 *                     type: string
 *                     description: The client's full name
 *                   paid:
 *                     type: number
 *                     format: double
 *                     description: The amount paid by the client
 *       500:
 *         description: Internal Server Error
 */
router.get('/best-clients', getBestClients);


module.exports = router;
