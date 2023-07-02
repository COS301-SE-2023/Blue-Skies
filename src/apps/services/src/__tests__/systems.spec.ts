import { Request, Response } from 'express';
import * as tedious from 'tedious';
import SystemController from '../controllers/system/system.controller';

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

describe('Test the System Controller', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  //Get all systems

  describe('getAllSystems', () => {
    it('should return all systems', () => {
      // Call the getAllSystems method with the mock request and response
      systemController.getAllSystems(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 if there is an error', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAllSystems method with the mock request and response
      systemController.getAllSystems(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    //error
    it('should return 500 if there is an error in the request', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to get All Systems');
      });

      // Call the getAllSystems method with the mock request and response
      systemController.getAllSystems(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get All Systems',
      });
    });
  });

  //Create a system

  describe('createSystem', () => {
    it('should create a system', () => {
      // Mock the request body data
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };

      // Call the createSystem method with the mock request and response
      systemController.createSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'System created successfully.',
      });
    });

    it('should return 400 if there is an error', () => {
      // Mock the request body data
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the createSystem method with the mock request and response
      systemController.createSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
    //error 500
    it('should return 500 if there is an error in the request', () => {
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create System');
      });

      // Call the createSystem method with the mock request and response
      systemController.createSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create System',
      });
    });
  });

  //Get a system

  describe('getSystem', () => {
    it('should return a system', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };

      // Call the getSystem method with the mock request and response
      systemController.getSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if there is an error', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getSystem method with the mock request and response
      systemController.getSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  //Update a system

  describe('updateSystem', () => {
    it('should update a system', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };

      // Call the updateSystem method with the mock request and response
      systemController.updateSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'System updated successfully.',
      });
    });

    it('should return 404 if there is an error', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the updateSystem method with the mock request and response
      systemController.updateSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    //error 500
    it('should return 500 if there is an error in the request', () => {
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        inverterOutput: '3000',
        numberOfPanels: '3',
        batterySize: '5000',
        numberOfBatteries: '2',
        solarInput: '3000',
      };
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to update System');
      });

      // Call the updateSystem method with the mock request and response
      systemController.updateSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update System',
      });
    });
  });

  //Delete a system

  describe('deleteSystem', () => {
    it('should delete a system', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };

      // Call the deleteSystem method with the mock request and response
      systemController.deleteSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'System deleted successfully.',
      });
    });

    it('should return 500 if there is an error', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the deleteSystem method with the mock request and response
      systemController.deleteSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    //Error 500
    it('should return 500 if there is an error in the request', () => {
      // Mock the request body data
      mockRequest.params = {
        keyId: '1',
      };

      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to delete System');
      });

      // Call the deleteSystem method with the mock request and response
      systemController.deleteSystem(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete System',
      });
    });
  });
});
