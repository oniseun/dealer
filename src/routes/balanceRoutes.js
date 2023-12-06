const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { depositMoney } = require('../controllers/balanceController');
const router = express.Router();

router.post('/deposit/:userId', getProfile, depositMoney);

module.exports = router;
