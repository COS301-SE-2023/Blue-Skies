import { Request, Response } from 'express';
import * as tedious from 'tedious';
import ReportApplianceController from '../controllers/report.appliance/report.appliance.controller';
import IReportAppliance from '../models/report.appliance.interface';

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

describe('ReportApplianceController', () => {
  let reportApplianceController: ReportApplianceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    reportApplianceController = new ReportApplianceController();
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

  //createReportAppliance
  describe('createReportAppliance', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        body: {
          reportId: 1,
          applianceId: 1,
          numberOfAppliances: 1,
        },
      };
      reportApplianceController.createReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Report appliance created successfully.',
      });
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        body: {
          reportId: 1,
          applianceId: 1,
          numberOfAppliances: 1,
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.createReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        body: {
          reportId: 1,
          applianceId: 1,
          numberOfAppliances: 1,
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not created.'), 0);
        }
      );
      reportApplianceController.createReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not created.',
      });
    });
  });

  //getAllReportAppliancec
  describe('getAllReportAppliance', () => {
    it('should return a 200 status code', () => {
      reportApplianceController.getAllReportAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IReportAppliance[]);
    });

    //500
    it('should return a 500 status code', () => {
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.getAllReportAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.getAllReportAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });
  });

  //getAppliancesInReport
  describe('getAppliancesInReport', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      reportApplianceController.getAppliancesInReport(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IReportAppliance[]);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.getAppliancesInReport(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.getAppliancesInReport(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.getAppliancesInReport(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //getReportsWithAppliance
  describe('getReportsWithAppliance', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      reportApplianceController.getReportsWithAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IReportAppliance[]);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.getReportsWithAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.getReportsWithAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.getReportsWithAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //getAppliance
  describe('getAppliance', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      reportApplianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.getAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //updateReportId
  describe('updateReportId', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
        body: {
          newReportId: '1',
        },
      };
      reportApplianceController.updateReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
        body: {
          newReportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.updateReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
        body: {
          newReportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.updateReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
        body: {
          newReportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.updateReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //updateApplianceId
  describe('updateApplianceId', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          newApplianceId: '1',
        },
      };
      reportApplianceController.updateApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          newApplianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.updateApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          newApplianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.updateApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
        body: {
          newApplianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.updateApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //updateNumberOfAppliancesId
  describe('updatenumberOfAppliances', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
        body: {
          numberOfAppliances: '1',
        },
      };
      reportApplianceController.updateNumberOfAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
        body: {
          numberOfAppliances: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.updateNumberOfAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
        body: {
          numberOfAppliances: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.updateNumberOfAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
        body: {
          numberOfAppliances: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.updateNumberOfAppliances(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //deleteReportId
  describe('deleteReportId', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      reportApplianceController.deleteReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.deleteReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.deleteReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.deleteReportId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //deleteApplianceId
  describe('deleteApplianceId', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      reportApplianceController.deleteApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.deleteApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.deleteApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.deleteApplianceId(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });

  //deleteReportAppliance
  describe('deleteReportAppliance', () => {
    it('should return a 200 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      reportApplianceController.deleteReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    //500
    it('should return a 500 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Error thrown');
        }
      );
      reportApplianceController.deleteReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error thrown',
      });
    });

    //400
    it('should return a 400 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Report appliance not found.'), 0);
        }
      );
      reportApplianceController.deleteReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Report appliance not found.',
      });
    });

    //404
    it('should return a 404 status code', () => {
      mockRequest = {
        params: {
          reportId: '1',
          applianceId: '1',
        },
      };
      // Simulate an error being thrown
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportApplianceController.deleteReportAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Report appliance does not exist.',
      });
    });
  });
});
