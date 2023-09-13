import { Request, Response } from 'express';
import * as tedious from 'tedious';
import ApplianceController from '../controllers/appliance/appliance.controller';

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
  Request: jest.fn().mockImplementation((query, callback) => {
    // Simulate a successful query with mock data
    // Simulate a successful query with mock data
    if (query.includes('WHERE keyId = 1')) {
      callback(null, 1);
    } else {
      callback(null, 0);
    }
    const rowCount = 2;
    callback(null, rowCount);
  }),
  ColumnValue: jest.fn(),
}));

describe('Test The Appliance Controller', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get All Appliances', () => {
    //Get All appliances
    it('should return all appliances', () => {
      // Create an instance of the KeyController
      // Call the getAllKeys method with the mock request and response
      applianceController.getAllAppliances(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
    //should return 400 if there is an error
    it('should return 400 if there is an error', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAllKeys method with the mock request and response
      applianceController.getAllAppliances(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
  describe('createAppliance', () => {
    it('should create the appliance successfully', () => {
      mockRequest = {
        body: {
          type: 'TV',
          powerUsage: 100,
        },
      } as Request;
      // Call the createAppliance method with the mock request and response
      applianceController.createAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Appliance created successfully.',
      });
    });

    it('should handle error when creating the appliance', () => {
      mockRequest = {
        body: {
          type: 'TV',
          powerUsage: 100,
        },
      } as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create appliance');
      });

      // Call the createAppliance method with the mock request and response
      applianceController.createAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create appliance',
      });
    });

    //should return 400 if there is an error
    it('should return 400 if there is an error', () => {
      mockRequest = {
        body: {
          type: 'TV',
          powerUsage: 100,
        },
      } as Request;
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the createAppliance method with the mock request and response
      applianceController.createAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('getAppliance', () => {
    it('should get the existing appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Call the getAppliance method with the mock request and response
      applianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return Not Found for a non-existing appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Update the mock request to have a non-existing applianceId
      mockRequest.params.applianceId = '999';

      // Call the getAppliance method with the mock request and response
      applianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should handle error when getting an appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to get appliance');
      });

      // Call the getAppliance method with the mock request and response
      applianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    //should return 400 if there is an error
    it('should return 400 if there is an error', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAppliance method with the mock request and response
      applianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('updateAppliance', () => {
    it('should update the existing appliance successfully', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          type: 'TV',
          powerUsage: 150,
        },
      } as unknown as Request;
      // Call the updateAppliance method with the mock request and response
      applianceController.updateAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Appliance updated successfully.',
      });
    });

    it('should return Not Found for a non-existing appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          type: 'TV',
          powerUsage: 150,
        },
      } as unknown as Request;

      // Update the mock request to have a non-existing applianceId
      mockRequest.params.applianceId = '999';

      // Call the updateAppliance method with the mock request and response
      applianceController.updateAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Appliance does not exist.',
      });
    });
    it('should handle error when updating an appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          type: 'TV',
          powerUsage: 150,
        },
      } as unknown as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to update appliance');
      });

      // Call the updateAppliance method with the mock request and response
      applianceController.updateAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update appliance',
      });
    });

    //should return 400 if there is an error
    it('should return 400 if there is an error', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          type: 'TV',
          powerUsage: 150,
        },
      } as unknown as Request;
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the updateAppliance method with the mock request and response
      applianceController.updateAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('deleteAppliance', () => {
    it('should delete the existing appliance successfully', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Call the deleteAppliance method with the mock request and response
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Appliance deleted successfully.',
      });
    });

    it('should return Not Found for a non-existing appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Update the mock request to have a non-existing applianceId
      mockRequest.params.applianceId = '999';

      // Call the deleteAppliance method with the mock request and response
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Appliance does not exist.',
      });
    });
    it('should handle error when deleting an appliance', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to delete appliance');
      });

      // Call the deleteAppliance method with the mock request and response
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete appliance',
      });
    });
    //should return 400 if there is an error
    it('should return 400 if there is an error', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      } as unknown as Request;
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the deleteAppliance method with the mock request and response
      applianceController.deleteAppliance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
});
