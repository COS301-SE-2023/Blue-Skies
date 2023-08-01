import { Request, Response } from 'express';
import * as tedious from 'tedious';
import BasicCalculationController from '../controllers/basic.calculation/basic.calculation.controller';
import IBasicCalculation from '../models/basic.calculation.interface';

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

describe('Basic Calculation Controller', () => {
  let basicCalculationController: BasicCalculationController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    basicCalculationController = new BasicCalculationController();
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

  // Create basic calculation
  describe('createBasicCalculation', () => {
    it('should create a basic calculation', () => {
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      basicCalculationController.createBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Basic calculation created successfully.',
      });
    });

    //should return 400 if error
    it('should return 400 if error', () => {
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      basicCalculationController.createBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //should return 500 if error
    it('should return 500 if error', () => {
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.createBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });
  });

  //getCreatedBasicCalculation
  describe('getCreatedBasicCalculation', () => {
    it('should return a basic calculation', () => {
      //systemId, dayLightHours, location
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
        },
      };

      basicCalculationController.getCreatedBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //400 error
    it('should return 400 if error', () => {
      //systemId, dayLightHours, location
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      basicCalculationController.getCreatedBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //500 error
    it('should return 500 if error', () => {
      //systemId, dayLightHours, location
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.getCreatedBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //404 error
    it('should return 404 if error', () => {
      //systemId, dayLightHours, location
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      basicCalculationController.getCreatedBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Basic calculation does not exist.',
      });
    });
  });

  // Get All Basic Calculations

  describe('getAllBasicCalculations', () => {
    it('should return all basic calculations', () => {
      basicCalculationController.getAllBasicCalculations(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IBasicCalculation[]);
    });

    //should return 400 if error
    it('should return 400 if error', () => {
      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      basicCalculationController.getAllBasicCalculations(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //should return 500 if error
    it('should return 500 if error', () => {
      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.getAllBasicCalculations(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve basic calculations.',
        details: 'Database connection error.',
      });
    });

    //should return 404 if no basic calculations found
    it('should return 404 if no basic calculations found', () => {
      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      basicCalculationController.getAllBasicCalculations(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'No basic calculations exist.',
      });
    });
  });

  // Get Basic Calculation By Id

  describe('getBasicCalculationById', () => {
    //should return basic calculation
    it('should return basic calculation', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      basicCalculationController.getBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //should return 404 if no basic calculation found
    it('should return 404 if no basic calculation found', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      basicCalculationController.getBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Basic calculation does not exist.',
      });
    });

    //should return 400 if error
    it('should return 400 if error', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      basicCalculationController.getBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //should return 500 if error
    it('should return 500 if error', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.getBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });
  });

  // Update Basic Calculation

  describe('updateBasicCalculation', () => {
    //should return basic calculation
    it('should return basic calculation', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      basicCalculationController.updateBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //should return 404 if no basic calculation found
    it('should return 404 if no basic calculation found', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      basicCalculationController.updateBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Basic calculation does not exist.',
      });
    });

    //should return 400 if error
    it('should return 400 if error', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      basicCalculationController.updateBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //should return 500 if error
    it('should return 500 if error', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.updateBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });
  });

  // Delete Basic Calculation

  describe('deleteBasicCalculation', () => {
    //should return 200
    it('should return 200', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      basicCalculationController.deleteBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //should return 404 if no basic calculation found
    it('should return 404 if no basic calculation found', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      basicCalculationController.deleteBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Basic calculation does not exist.',
      });
    });

    //should return 400 if error
    it('should return 400 if error', () => {
      mockRequest = {
        body: {
          systemId: 1,
          dayLightHours: 1,
          location: 'Test Location',
          batteryLife: 1,
        },
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'), 2);
        }
      );

      basicCalculationController.deleteBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    //should return 500 if error
    it('should return 500 if error', () => {
      mockRequest = {
        params: {
          basicCalculationId: '1',
        },
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      basicCalculationController.deleteBasicCalculation(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });
  });
});
