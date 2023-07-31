import { Request, Response } from 'express';
import * as tedious from 'tedious';
import ReportAllAppliancesController from '../controllers/report.all.appliances/report.all.appliances.controller';
import IReportAllAppliance from '../models/report.all.appliances.interface';

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

describe('Test the reportAllAppliances controller', () => {
  let reportAllAppliancesController: ReportAllAppliancesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    reportAllAppliancesController = new ReportAllAppliancesController();
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
  //getAllReportAllAppliance
  describe('Test the getAllReportAllAppliance method', () => {
    //200
    it('Test the getAllReportAllAppliance method with a 200', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      reportAllAppliancesController.getAllReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        [] as IReportAllAppliance[]
      );
    });
    //400
    it('Test the getAllReportAllAppliance method with a 400', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      reportAllAppliancesController.getAllReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });
    //404
    it('Test the getAllReportAllAppliance method with a 404', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportAllAppliancesController.getAllReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'No report all appliance records exist.',
      });
    });
    //500
    it('Test the getAllReportAllAppliance method with a 500', () => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      reportAllAppliancesController.getAllReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });

  //getReportAllAppliance
  describe('Test the getReportAllAppliance method', () => {
    //200
    it('Test the getReportAllAppliance method with a 200', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      reportAllAppliancesController.getReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        [] as IReportAllAppliance[]
      );
    });

    //400
    it('Test the getReportAllAppliance method with a 400', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      reportAllAppliancesController.getReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });

    //404
    it('Test the getReportAllAppliance method with a 404', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      reportAllAppliancesController.getReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    //500
    it('Test the getReportAllAppliance method with a 500', () => {
      mockRequest = {
        params: {
          reportId: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      reportAllAppliancesController.getReportAllAppliance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
});
