import { Request, Response } from 'express';
import * as tedious from 'tedious';
import LocationDataController from '../controllers/location.data/location.data.controller';
import ILocationData from '../models/location.data.interface';

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

describe('Test the locationData controller', () => {
  let locationDataController: LocationDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    locationDataController = new LocationDataController();
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
  //Creation of a new locationData
  describe('Test the createLocationData method', () => {
    //200
    it('Test the createLocationData method with a 200', () => {
      //     latitude,
      //   longitude,
      //   locationName,
      //   solarPanelsData,
      //   satteliteImageData,
      //   annualFluxData,
      //   monthlyFluxData,
      //   maskData,
      //   horisonElevationData,
      const mockLocationData = {
        latitude: '1',
        longitude: '1',
        locationName: 'test',
        solarPanelsData: 'test',
        satteliteImageData: 'test',
        annualFluxData: 'test',
        monthlyFluxData: 'test',
        maskData: 'test',
        horisonElevationData: 'test',
      };
      mockRequest.body = mockLocationData;
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      locationDataController.createLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation created successfully.',
      });
    });
    //400
    it('Test the createLocationData method with a 400', () => {
      const mockLocationData = {
        latitude: '1',
        longitude: '1',
        locationName: 'test',
        solarPanelsData: 'test',
        satteliteImageData: 'test',
        annualFluxData: 'test',
        monthlyFluxData: 'test',
        maskData: 'test',
        horisonElevationData: 'test',
      };
      mockRequest.body = mockLocationData;
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      locationDataController.createLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });

    //500
    it('Test the createLocationData method with a 500', () => {
      const mockLocationData = {
        latitude: '1',
        longitude: '1',
        locationName: 'test',
        solarPanelsData: 'test',
        satteliteImageData: 'test',
        annualFluxData: 'test',
        monthlyFluxData: 'test',
        maskData: 'test',
        horisonElevationData: 'test',
      };
      mockRequest.body = mockLocationData;
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      locationDataController.createLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });

  //getLocationData
  describe('Test the getLocationData method', () => {
    //200
    it('Test the getLocationData method with a 200', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      locationDataController.getLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the getLocationData method with a 400', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      locationDataController.getLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });
    //404
    it('Test the getLocationData method with a 404', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      locationDataController.getLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });
    //500
    it('Test the getLocationData method with a 500', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      locationDataController.getLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
  describe('Test the getEssentialData method', () => {
    //200
    it('Test the getEssentialData method with a 200', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      locationDataController.getEssentialData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the getEssentialData method with a 400', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      locationDataController.getEssentialData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });
    //404
    it('Test the getEssentialData method with a 404', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      locationDataController.getEssentialData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });
    //500
    it('Test the getEssentialData method with a 500', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      locationDataController.getEssentialData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
  //   deleteLocationData
  describe('Test the deleteLocationData method', () => {
    //200
    it('Test the deleteLocationData method with a 200', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      locationDataController.deleteLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //400
    it('Test the deleteLocationData method with a 400', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      locationDataController.deleteLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });
    //404
    it('Test the deleteLocationData method with a 404', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      locationDataController.deleteLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });
    //500
    it('Test the deleteLocationData method with a 500', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      locationDataController.deleteLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });

  //   checkIfLocationDataExists
  describe('Test the checkIfLocationDataExists method', () => {
    // 200
    it('Test the checkIfLocationDataExists method with a 200', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 1);
        }
      );
      locationDataController.checkIfLocationDataExists(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation found.',
      });
    });
    // 400
    it('Test the checkIfLocationDataExists method with a 400', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Bad Request'), 1);
        }
      );
      locationDataController.checkIfLocationDataExists(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
      });
    });
    // 404
    it('Test the checkIfLocationDataExists method with a 404', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      locationDataController.checkIfLocationDataExists(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });
    // 500
    it('Test the checkIfLocationDataExists method with a 500', () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Internal Server Error');
        }
      );
      locationDataController.checkIfLocationDataExists(
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
