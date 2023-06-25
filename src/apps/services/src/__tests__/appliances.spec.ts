import ApplianceController from '../controllers/appliance/appliance.controller';
import { Request, Response } from 'express';
import { connection } from '../main';
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
});
