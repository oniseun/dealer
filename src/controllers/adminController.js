const { getBestProfessionService, getBestClientsService } = require('../services/adminService');

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  try {
    const bestProfession = await getBestProfessionService(start, end);

    res.json(bestProfession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const bestClients = await getBestClientsService(start, end, limit);

    res.json(bestClients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getBestProfession, getBestClients };
