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
  });

  //create system
});
