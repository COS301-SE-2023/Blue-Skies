import { Request, Response } from 'express';
import * as tedious from 'tedious';
import SolarScoreController from '../controllers/solar.score/solar.score.controller';

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

  //createSolarScore
  describe('createSolarScore', () => {
    //200
    it('should return 200', async () => {
      mockRequest.body = {
        solarScoreId: '1',
        data: 'test',
        remainingCalls: 1,
      };
      await solarScoreController.createSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //400
    it('should return 400', async () => {
      mockRequest.body = {
        solarScoreId: '1',
        data: 'test',
        remainingCalls: 1,
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('test error'), 0);
        }
      );

      await solarScoreController.createSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });

    //500
    it('should return 500', async () => {
      mockRequest.body = {
        solarScoreId: '1',
        data: 'test',
        remainingCalls: 1,
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('test error');
        }
      );

      await solarScoreController.createSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });
  });

  //updateSolarScore
  describe('updateSolarScore', () => {
    //200
    it('should return 200', async () => {
      mockRequest.body = {
        data: 'test',
        remainingCalls: 1,
      };
      mockRequest.params = {
        solarScoreId: '1',
      };
      await solarScoreController.updateSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //400
    it('should return 400', async () => {
      mockRequest.body = {
        data: 'test',
        remainingCalls: 1,
      };
      mockRequest.params = {
        solarScoreId: '1',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('test error'), 0);
        }
      );

      await solarScoreController.updateSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });

    //500
    it('should return 500', async () => {
      mockRequest.body = {
        data: 'test',
        remainingCalls: 1,
      };
      mockRequest.params = {
        solarScoreId: '1',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('test error');
        }
      );

      await solarScoreController.updateSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });
  });

  //delete SolarScore
  describe('deleteSolarScore', () => {
    //200
    it('should return 200', async () => {
      mockRequest.params = {
        solarScoreId: '1',
      };
      await solarScoreController.deleteSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //400
    it('should return 400', async () => {
      mockRequest.params = {
        solarScoreId: '1',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('test error'), 0);
        }
      );

      await solarScoreController.deleteSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });

    //500
    it('should return 500', async () => {
      mockRequest.params = {
        solarScoreId: '1',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('test error');
        }
      );

      await solarScoreController.deleteSolarScore(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });
  });
});
