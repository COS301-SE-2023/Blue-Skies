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
});
