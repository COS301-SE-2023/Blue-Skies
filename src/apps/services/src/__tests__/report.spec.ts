import { Request, Response } from 'express';
import * as tedious from 'tedious';
import ReportController from '../controllers/report/report.controller';
import IReport from '../models/report.interface';

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

describe('Report Controller', () => {
  let reportController: ReportController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    reportController = new ReportController();
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

  //CREATE REPORT
  describe('createReport', () => {
    it('should return a successful response with a message when the query is successful', () => {
      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest = {
        body: mockReport,
      };

      reportController.createReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Report created successfully.',
      });
    });

    it('should return a 400 response with an error message when the query is unsuccessful', () => {
      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest = {
        body: mockReport,
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      reportController.createReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    it('should return a 500 response with an error message when an error is thrown', () => {
      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest = {
        body: mockReport,
      };

      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      reportController.createReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });
  });

  //GET ALL REPORTS
  describe('getAllReports', () => {
    it('should return a successful response with a message when the query is successful', () => {
      reportController.getAllReports(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IReport[]);
    });

    it('should return a 400 response with an error message when the query is unsuccessful', () => {
      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      reportController.getAllReports(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    it('should return a 500 response with an error message when an error is thrown', () => {
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      reportController.getAllReports(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //404
    it('should return a 404 response with an error message when the query returns no rows', () => {
      // Simulate a successful query with no rows
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          const rowCount = 0;

          callback(null, rowCount);
        }
      );

      reportController.getAllReports(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'No reports exist.',
      });
    });
  });

  //getReport
  describe('getReport', () => {
    it('should return a successful response with a message when the query is successful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      reportController.getReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return a 400 response with an error message when the query is unsuccessful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      reportController.getReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    it('should return a 500 response with an error message when an error is thrown', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      reportController.getReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //404
    it('should return a 404 response with an error message when the query returns no rows', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate a successful query with no rows
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          const rowCount = 0;

          callback(null, rowCount);
        }
      );

      reportController.getReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report does not exist.',
      });
    });
  });

  //updateReport
  describe('updateReport', () => {
    it('should return a successful response with a message when the query is successful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest.body = mockReport;

      reportController.updateReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return a 400 response with an error message when the query is unsuccessful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest.body = mockReport;

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      reportController.updateReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    it('should return a 500 response with an error message when an error is thrown', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest.body = mockReport;

      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      reportController.updateReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update report.',
        details: 'Database connection error.',
      });
    });

    //404
    it('should return a 404 response with an error message when the query returns no rows', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      const mockReport = {
        reportName: 'testReport',
        userId: 1,
        basicCalculationId: 1,
        solarScore: 1,
        runningTime: 1,
      };

      mockRequest.body = mockReport;

      // Simulate a successful query with no rows
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          const rowCount = 0;

          callback(null, rowCount);
        }
      );

      reportController.updateReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report does not exist.',
      });
    });
  });

  //deleteReport
  describe('deleteReport', () => {
    it('should return a successful response with a message when the query is successful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      reportController.deleteReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return a 400 response with an error message when the query is unsuccessful', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate a failed query
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Query failed'));
        }
      );

      reportController.deleteReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Query failed',
      });
    });

    it('should return a 500 response with an error message when an error is thrown', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );

      reportController.deleteReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //404
    it('should return a 404 response with an error message when the query returns no rows', () => {
      // Mock the request body data
      mockRequest.params = {
        reportId: '1',
      };

      // Simulate a successful query with no rows
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          const rowCount = 0;

          callback(null, rowCount);
        }
      );

      reportController.deleteReport(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report does not exist.',
      });
    });
  });
});
