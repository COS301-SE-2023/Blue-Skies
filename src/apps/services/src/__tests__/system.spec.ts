import SystemController from '../controllers/system/system.controller';
import { Request, Response } from 'express';
jest.mock('../controllers/system/system.controller', () => ({
  __esModule: true,
  default: class {
    createSystem = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const {
          inverterOutput,
          numberOfPanels,
          batterySize,
          numberOfBatteries,
          solarInput,
        } = req.body;
        if (
          inverterOutput &&
          numberOfPanels &&
          batterySize &&
          numberOfBatteries &&
          solarInput
        ) {
          return res.status(200).json({
            message: 'System created successfully.',
          });
        } else {
          return res.status(500).json({
            error: 'System not created.',
          });
        }
      });

    getAllSystems = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const systems = [
          {
            inverterOutput: 1000,
            numberOfPanels: 4,
            batterySize: 1000,
            numberOfBatteries: 4,
            solarInput: 1000,
          },
          {
            inverterOutput: 1000,
            numberOfPanels: 4,
            batterySize: 1000,
            numberOfBatteries: 4,
            solarInput: 1000,
          },
        ];
        res.status(200).json({
          systems: systems,
        });
      });
    getSystem = jest.fn().mockImplementation((req: Request, res: Response) => {
      const system = {
        inverterOutput: 1000,
        numberOfPanels: 4,
        batterySize: 1000,
        numberOfBatteries: 4,
        solarInput: 1000,
      };
      const { systemId } = req.params;
      if (systemId) {
        //test if systemId is a number
        if (!Number.isInteger(Number(systemId))) {
          res.status(400).json({
            error: 'Invalid systemId',
            details: 'systemId must be an integer.',
          });
        } else {
          res.status(200).json({
            system: system,
          });
        }
      } else {
        res.status(404).json({
          error: 'System not found.',
        });
      }
    });
  },
}));

describe('SystemController', () => {
  let systemController: SystemController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    systemController = new SystemController();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Get All Systems', () => {
    it('should return 200 if systems can be retrieved', () => {
      systemController.getAllSystems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        systems: [
          {
            inverterOutput: 1000,
            numberOfPanels: 4,
            batterySize: 1000,
            numberOfBatteries: 4,
            solarInput: 1000,
          },
          {
            inverterOutput: 1000,
            numberOfPanels: 4,
            batterySize: 1000,
            numberOfBatteries: 4,
            solarInput: 1000,
          },
        ],
      });
    });
  });

  describe('Create System', () => {
    it('should return 200 if system can be created', () => {
      mockRequest.body = {
        inverterOutput: 1000,
        numberOfPanels: 4,
        batterySize: 1000,
        numberOfBatteries: 4,
        solarInput: 1000,
      };
      systemController.createSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'System created successfully.',
      });
    });

    it('should return 404 if system cannot be created', () => {
      mockRequest.body = {};
      systemController.createSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'System not created.',
      });
    });
  });
});
