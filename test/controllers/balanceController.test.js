const { depositMoney } = require('../../src/controllers/balanceController');
const { depositMoneyService } = require('../../src/services/balanceService');

jest.mock('../../src/services/balanceService');

describe('balanceController', () => {
  describe('depositMoney', () => {
    it('should deposit money successfully', async () => {
      const userId = '1';
      const amount = '50.5';

      depositMoneyService.mockResolvedValue();

      const req = {
        params: { userId },
        body: { amount },
        profile: { id: Number(userId) }, // Assuming authenticated user's profile
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await depositMoney(req, res);

      expect(depositMoneyService).toHaveBeenCalledWith(userId, amount);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deposit successful' });
    });

    it('should return 400 for invalid input', async () => {
      const userId = 'invalid-user-id';
      const amount = 'invalid-amount';

      const req = {
        params: { userId },
        body: { amount },
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await depositMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Both userId and amount are required, and userId must be a number, amount must be a decimal or number.' });
    });

    it('should return 403 for unauthorized access', async () => {
      const userId = '2'; // Assuming userId is different from authenticated user's profile id
      const amount = '50.5';

      const req = {
        params: { userId },
        body: { amount },
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await depositMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized. userId does not match the authenticated user.' });
    });
  });
});
