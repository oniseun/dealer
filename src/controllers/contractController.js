const { getContractByIdService, getContractsService } = require('../services/contractService');

const getContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await getContractByIdService(req.profile.id, id);

    if (!contract) return res.status(404).end();

    res.json(contract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getContracts = async (req, res) => {
  try {
    const contracts = await getContractsService(req.profile.id);

    res.json(contracts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getContractById, getContracts };
