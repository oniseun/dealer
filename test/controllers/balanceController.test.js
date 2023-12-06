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
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await depositMoney(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Both userId and amount are required, and userId must be a number, amount must be a decimal or number.' });
    });

  });
});
