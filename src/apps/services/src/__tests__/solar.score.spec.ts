import { Request, Response } from 'express';
import * as tedious from 'tedious';
import SolarScoreController from '../controllers/solar.score/solar.score.controller';
import ISolarIrradiation from '../models/solar.irradiation.interfact';
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

describe('Solar Score Controller', () => {
  let solarScoreController: SolarScoreController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    solarScoreController = new SolarScoreController();
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

  //createSolarIrradiation
  describe('should create solar Irradiation', () => {
    //200
    it('should return 200 if solar Irradiation is created', () => {
      mockRequest = {
        body: {
          latitude: 1,
          longitude: 1,
        },
      };
      solarScoreController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation created successfully.',
      });
    });

    //400
    it('should return 400 if solar Irradiation is not created', () => {
      mockRequest = {
        body: {
          latitude: 1,
          longitude: 1,
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Invalid request.'), 1);
        }
      );
      solarScoreController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid request.',
      });
    });

    //500
    it('should return 500 if solar Irradiation is not created', () => {
      mockRequest = {
        body: {
          latitude: 1,
          longitude: 1,
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal server error.');
        }
      );
      solarScoreController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error.',
      });
    });
  });
});
