const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getBestProfession, getBestClients } = require('../controllers/adminController');
const router = express.Router();

router.get('/best-profession', getProfile, getBestProfession);
router.get('/best-clients', getProfile, getBestClients);

module.exports = router;
