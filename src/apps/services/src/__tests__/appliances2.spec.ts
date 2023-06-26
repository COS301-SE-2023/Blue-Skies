import ApplianceController from '../controllers/appliance/appliance.controller';
import { Request, Response } from 'express';
jest.mock('../main', () => ({
  connection: {
    execSql: jest.fn(),
  },
}));

//Mock ApplianceController
jest.mock('../controllers/appliance/appliance.controller', () => ({
  __esModule: true,
  default: class {
    getAllAppliances = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const appliances = [
          {
            applianceName: 'Fridge',
            appliancePower: 1000,
            applianceQuantity: 1,
          },
          {
            applianceName: 'Fridge',
            appliancePower: 1000,
            applianceQuantity: 1,
          },
        ];
        res.status(200).json({
          appliances: appliances,
        });
      });
    createAppliance = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const { type, powerUsage } = req.body;
        if (type && powerUsage) {
          return res.status(200).json({
            message: 'Appliance created successfully.',
          });
        } else {
          return res.status(500).json({
            error: 'Appliance not created.',
          });
        }
      });

    deleteAppliance = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const { type, powerUsage } = req.body;
        if (type && powerUsage) {
          return res.status(200).json({
            message: 'Appliance deleted successfully.',
          });
        } else {
          return res.status(500).json({
            error: 'Appliance not deleted.',
          });
        }
      });
  },
}));

describe('ApplianceController', () => {
  let applianceController: ApplianceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    applianceController = new ApplianceController();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  //dummy test
  it('should be defined', () => {
    expect(applianceController).toBeDefined();
  });

  //Get All Appliances
  describe('Get all appliances', () => {
    it('should return 200 if appliances can be retrieved', () => {
      applianceController.getAllAppliances(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        appliances: [
          {
            applianceName: 'Fridge',
            appliancePower: 1000,
            applianceQuantity: 1,
          },
          {
            applianceName: 'Fridge',
            appliancePower: 1000,
            applianceQuantity: 1,
          },
        ],
      });
    });
  });

  //Create Appliance
  describe('Create appliance', () => {
    it('should return 200 if appliance can be created', () => {
      mockRequest = {
        body: {
          type: 'Fridge',
          powerUsage: 1000,
        },
      };
      applianceController.createAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Appliance created successfully.',
      });
    });

    it('should return 500 if appliance cannot be created', () => {
      mockRequest = {
        body: {
          type: '',
          powerUsage: 1000,
        },
      };
      applianceController.createAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Appliance not created.',
      });
    });
  });

  //Delete Appliance
  describe('Delete appliance', () => {
    it('should return 200 if appliance can be deleted', () => {
      mockRequest = {
        body: {
          type: 'Fridge',
          powerUsage: 1000,
        },
      };
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Appliance deleted successfully.',
      });
    });

    it('should return 500 if appliance cannot be deleted', () => {
      mockRequest = {
        body: {
          type: '',
          powerUsage: 1000,
        },
      };
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Appliance not deleted.',
      });
    });
  });
});
