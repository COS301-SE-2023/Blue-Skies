import LocationDataController from '../controllers/location.data/location.data.controller';
import { Request, Response } from 'express';
import * as tedious from 'tedious';

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

describe('LocationDataController', () => {
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

  //   createSolarIrradiation

  describe('createSolarIrradiation', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      //   latitude,
      //   longitude,
      //   location,
      //   daylightHours,
      //   image,
      //   elevationData,

      mockRequest = {
        body: {
          latitude: '1',
          longitude: '1',
          location: 'test',
          daylightHours: '1',
          image: 'test',
          elevationData: 'test',
        },
      };

      await locationDataController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation created successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      //   latitude,
      //   longitude,
      //   location,
      //   daylightHours,
      //   image,
      //   elevationData,

      mockRequest = {
        body: {
          latitude: '1',
          longitude: '1',
          location: 'test',
          daylightHours: '1',
          image: 'test',
          elevationData: 'test',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      await locationDataController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      //   latitude,
      //   longitude,
      //   location,
      //   daylightHours,
      //   image,
      //   elevationData,

      mockRequest = {
        body: {
          latitude: '1',
          longitude: '1',
          location: 'test',
          daylightHours: '1',
          image: 'test',
          elevationData: 'test',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      await locationDataController.createSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // updateDataLocationData
  describe('updateDataLocationData', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        body: {
          data: 'test',
          remainingCalls: 5,
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.updateDataLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'updated data in LocationData successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        body: {
          data: 'test',
          remainingCalls: 5,
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.updateDataLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        body: {
          data: 'test',
          remainingCalls: 5,
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.updateDataLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // updateDaylightHoursLocationData
  describe('updateDaylightHoursLocationData', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        body: {
          daylightHours: '12',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.updateDaylightHoursLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'updated daylightHours in LocationData successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        body: {
          daylightHours: '12',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.updateDaylightHoursLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        body: {
          daylightHours: '12',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.updateDaylightHoursLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
  // updateImgLocationData
  describe('updateImgLocationData', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        body: {
          image: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.updateImgLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'updated image in LocationData successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        body: {
          image: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.updateImgLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        body: {
          image: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.updateImgLocationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // updateElevationData
  describe('updateElevationData', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        body: {
          elevationData: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.updateElevationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'updated elevationData in LocationData successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        body: {
          elevationData: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.updateElevationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        body: {
          elevationData: 'test',
        },
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.updateElevationData(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // getSolarIrradiation
  describe('getSolarIrradiation', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.getSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.getSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 404 if data does not exist
    it('should return 404 if data does not exist', async () => {
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
      locationDataController.getSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.getSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // getSolarIrradiationWithoutImage
  describe('getSolarIrradiationWithoutImage', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.getSolarIrradiationWithoutImage(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.getSolarIrradiationWithoutImage(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 404 if data does not exist
    it('should return 404 if data does not exist', async () => {
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
      locationDataController.getSolarIrradiationWithoutImage(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.getSolarIrradiationWithoutImage(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // deleteSolarIrradiation
  describe('deleteSolarIrradiation', () => {
    // should return 200 if the query is successful
    it('should return 200 if the query is successful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };

      locationDataController.deleteSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation deleted successfully.',
      });
    });

    // should return 400 if the query is unsuccessful
    it('should return 400 if the query is unsuccessful', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      locationDataController.deleteSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 404 if data does not exist
    it('should return 404 if data does not exist', async () => {
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
      locationDataController.deleteSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Solar Irradiation not found.',
      });
    });

    // should return 500 if an error is thrown
    it('should return 500 if an error is thrown', async () => {
      mockRequest = {
        params: {
          latitude: '1',
          longitude: '1',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );
      locationDataController.deleteSolarIrradiation(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
});
