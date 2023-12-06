const { getBestProfession, getBestClients } = require('../../src/controllers/adminController');
const { getBestProfessionService, getBestClientsService } = require('../../src/services/adminService');

jest.mock('../../src/services/adminService');

describe('adminController', () => {
  describe('getBestProfession', () => {
    it('should return the best profession', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const mockProfessionResult = { profession: 'Engineer', totalEarnings: 100 };

      getBestProfessionService.mockResolvedValue(mockProfessionResult);

      const req = { query: { start, end } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getBestProfession(req, res);

      expect(getBestProfessionService).toHaveBeenCalledWith(start, end);
      expect(res.json).toHaveBeenCalledWith(mockProfessionResult);
    });

    it('should return 400 for invalid start date', async () => {
      const start = 'invalid-date';
      const end = '2023-12-31';
      const req = { query: { start, end } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getBestProfession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Both start and end dates must be valid.' });
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const limit = '5';
      const mockClientsResult = [
        { id: 1, fullName: 'John Doe', paid: 150 },
        // Add more mocked client data as needed
      ];

      getBestClientsService.mockResolvedValue(mockClientsResult);

      const req = { query: { start, end, limit } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getBestClients(req, res);

      expect(getBestClientsService).toHaveBeenCalledWith(start, end, limit);
      expect(res.json).toHaveBeenCalledWith(mockClientsResult);
    });

    it('should return 400 for invalid limit', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const limit = 'invalid-limit';
      const req = { query: { start, end, limit } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getBestClients(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Both start and end dates must be valid, and limit must be a number.' });
    });
  });
});
