import { Request, Response } from 'express';
import * as tedious from 'tedious';
import CustomAppliancesController from '../controllers/custom.appliances/custom.appliances.controller';
import ICustomAppliance from '../models/custom.appliance.interface';

jest.mock('../main', () => jest.fn());
jest.mock('../main', () => {
  return {
    connection: {
      execSql: jest.fn(),
    },
  };
});

// Mock the dependencies and modules
jest.mock('tedious', () => ({
  Request: jest.fn(),
}));

describe('Test the customAppliances controller', () => {
  let customAppliancesController: CustomAppliancesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    customAppliancesController = new CustomAppliancesController();
  });
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  //getAllCustomAppliance
  describe('Test the getAllCustomAppliance method', () => {
    //200
    it('Test the getAllCustomAppliance method with a 200', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      customAppliancesController.getAllCustomAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the getAllCustomAppliance method with a 400', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad request'), 1);
        }
      );
      customAppliancesController.getAllCustomAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    //500
    it('Test the getAllCustomAppliance method with a 500', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Internal server error'), 1);
        }
      );
      customAppliancesController.getAllCustomAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
  //createCustomAppliance
  describe('Test the createCustomAppliance method', () => {
    //200
    it('Test the createCustomAppliance method with a 200', () => {
      mockRequest = {
        body: {
          type: 'test',
          model: 'test',
          powerUsage: 1,
        },
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      customAppliancesController.createCustomAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the createCustomAppliance method with a 400', () => {
      mockRequest = {
        body: {
          type: 'test',
          model: 'test',
          powerUsage: 1,
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad request'), 1);
        }
      );
      customAppliancesController.createCustomAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    //500
    it('Test the createCustomAppliance method with a 500', () => {
      mockRequest = {
        body: {
          type: 'test',
          model: 'test',
          powerUsage: 1,
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal server error');
        }
      );
      customAppliancesController.createCustomAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
  //deleteCustomAppliance
  describe('Test the deleteCustomAppliance method', () => {
    //200
    it('Test the deleteCustomAppliance method with a 200', () => {
      mockRequest = {
        params: {
          customApplianceId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      customAppliancesController.deleteCustomAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the deleteCustomAppliance method with a 400', () => {
      mockRequest = {
        params: {
          customApplianceId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad request'), 1);
        }
      );
      customAppliancesController.deleteCustomAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    //500
    it('Test the deleteCustomAppliance method with a 500', () => {
        mockRequest = {
            params: {
            customApplianceId: '1',
            },
        };
        (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
            (query, callback) => {
            throw new Error('Internal server error');
            }
        );
        customAppliancesController.deleteCustomAppliance(
            mockRequest as Request,
            mockResponse as Response
        );
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        }
    );
  });
});
