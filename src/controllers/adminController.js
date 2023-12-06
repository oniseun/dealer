const { getBestProfessionService, getBestClientsService } = require('../services/adminService');

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(Date.parse(dateString));
};

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  // Validate input
  if (!start || !end || !isValidDate(start) || !isValidDate(end)) {
    return res.status(400).json({ error: 'Invalid input. Both start and end dates must be valid.' });
  }

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

  // Validate input
  if (!start || !end || !isValidDate(start) || !isValidDate(end) || isNaN(Number(limit))) {
    return res.status(400).json({ error: 'Invalid input. Both start and end dates must be valid, and limit must be a number.' });
  }

  try {
    const bestClients = await getBestClientsService(start, end, limit);

    res.json(bestClients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getBestProfession, getBestClients };
