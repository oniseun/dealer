const { getContractById, getContracts } = require('../../src/controllers/contractController');
const { getContractByIdService, getContractsService } = require('../../src/services/contractService');

jest.mock('../../src/services/contractService');

describe('contractController', () => {
  describe('getContractById', () => {
    it('should get contract by ID successfully', async () => {
      const id = '1';

      getContractByIdService.mockResolvedValue({ id: 1 });

      const req = {
        params: { id },
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getContractById(req, res);

      expect(getContractByIdService).toHaveBeenCalledWith(req.profile.id, id);
      expect(res.json).toHaveBeenCalledWith({ id: 1, });
    });

    it('should return 404 for non-existing contract', async () => {
      const id = '2';

      getContractByIdService.mockResolvedValue(null);

      const req = {
        params: { id },
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      await getContractById(req, res);

      expect(getContractByIdService).toHaveBeenCalledWith(req.profile.id, id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return 400 for invalid input', async () => {
      const id = 'invalid-id';

      const req = {
        params: { id },
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getContractById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input. Contract ID must be a number.' });
    });

  });

  describe('getContracts', () => {
    it('should get contracts successfully', async () => {
      getContractsService.mockResolvedValue([{ id: 1, }, ]);

      const req = {
        profile: { id: 1 }, // Assuming authenticated user's profile
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getContracts(req, res);

      expect(getContractsService).toHaveBeenCalledWith(req.profile.id);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, }, ]);
    });

  });
});
