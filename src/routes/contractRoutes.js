const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getContracts } = require('../controllers/contractController');
const router = express.Router();

router.get('/:id', getProfile, getContractById);
router.get('/', getProfile, getContracts);

module.exports = router;
