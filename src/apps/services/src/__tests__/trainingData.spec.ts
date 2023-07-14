import { Request, Response } from 'express';
import * as tedious from 'tedious';

import TrainingDataController from '../controllers/training.data/training.data.controller';
import ITrainingData from '../models/training.data.interface';
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

describe('Training Data Controller', () => {
  let trainingDataController: TrainingDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    trainingDataController = new TrainingDataController();
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

  describe('createTrainingData', () => {
    it('should call res.status(200) when the query is successful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      trainingDataController.createTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Training data created successfully.',
      });
    });

    it('should call res.status(400) when the query is unsuccessful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(mockError, null);
        }
      );

      trainingDataController.createTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(500) when the query throws an error', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw mockError;
        }
      );

      trainingDataController.createTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });
  });

  //getAllTrainingData
  describe('getAllTrainingData', () => {
    it('should call res.status(200) when the query is successful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      trainingDataController.getAllTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as ITrainingData[]);
    });

    it('should call res.status(400) when the query is unsuccessful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(mockError, null);
        }
      );

      trainingDataController.getAllTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(500) when the query throws an error', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw mockError;
        }
      );

      trainingDataController.getAllTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(404) when the query returns no data', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.body = mockBody;

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      trainingDataController.getAllTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'No training data exists.',
      });
    });
  });

  //getTrainingData
  describe('getTrainingData', () => {
    it('should call res.status(200) when the query is successful', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      trainingDataController.getTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should call res.status(400) when the query is unsuccessful', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(mockError, null);
        }
      );

      trainingDataController.getTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(500) when the query throws an error', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw mockError;
        }
      );

      trainingDataController.getTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(404) when the query returns no data', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      trainingDataController.getTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Training data does not exist.',
      });
    });
  });

  //updateTrainingData
  describe('updateTrainingData', () => {
    it('should call res.status(200) when the query is successful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.params = {
        trainingDataId: '1',
      };
      mockRequest.body = mockBody;

      trainingDataController.updateTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should call res.status(400) when the query is unsuccessful', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.params = {
        trainingDataId: '1',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(mockError, null);
        }
      );

      trainingDataController.updateTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(500) when the query throws an error', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.params = {
        trainingDataId: '1',
      };
      mockRequest.body = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw mockError;
        }
      );

      trainingDataController.updateTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(404) when the query returns no data', () => {
      const mockBody = {
        solarIrradiation: 1.2,
        image: 'some image',
        areaId: 1,
        date: 'some date',
      };
      mockRequest.params = {
        trainingDataId: '1',
      };
      mockRequest.body = mockBody;

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      trainingDataController.updateTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Training data does not exist.',
      });
    });
  });

  //deleteTrainingData
  describe('deleteTrainingData', () => {
    it('should call res.status(200) when the query is successful', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      trainingDataController.deleteTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should call res.status(400) when the query is unsuccessful', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(mockError, null);
        }
      );

      trainingDataController.deleteTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(500) when the query throws an error', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      const mockError = new Error('some error');
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw mockError;
        }
      );

      trainingDataController.deleteTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });

    it('should call res.status(404) when the query returns no data', () => {
      const mockBody = {
        trainingDataId: '1',
      };
      mockRequest.params = mockBody;

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      trainingDataController.deleteTrainingData(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Training data does not exist.',
      });
    });
  });
});
