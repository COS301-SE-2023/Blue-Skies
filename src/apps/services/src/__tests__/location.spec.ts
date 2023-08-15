import LocationController from '../controllers/location/location.controller';
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
    if (query.includes('WHERE locationId = 1')) {
      callback(null, 1);
    } else {
      callback(null, 0);
    }
    const rowCount = 2;

    callback(null, rowCount);
  }),
  ColumnValue: jest.fn(),
}));

describe('Test the Location Controller', () => {
  let locationController: LocationController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    locationController = new LocationController();
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

  describe('getAllLocations', () => {
    it('should return all locations', () => {
      // Call the getAllLocations method with the mock request and response
      locationController.getAllLocations(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should handle error when getting all locations', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to get locations');
      });

      // Call the getAllLocations method with the mock request and response
      locationController.getAllLocations(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get locations',
      });
    });

    //400
    it('should return 400 when getting all locations', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAllLocations method with the mock request and response
      locationController.getAllLocations(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  //Create a test for the createLocation method
  describe('createLocation', () => {
    it('should create a new location', () => {
      mockRequest = {
        body: {
          latitude: 1.1,
          longitude: 1.1,
        },
      };
      // Call the createLocation method with the mock request and response
      locationController.createLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Location created successfully.',
      });
    });

    it('should handle error when creating a location', () => {
      mockRequest = {
        body: {
          latitude: 1.0,
          longitude: 1.0,
        },
      };
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create location');
      });

      // Call the createLocation method with the mock request and response
      locationController.createLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create location',
      });
    });

    //400
    it('should return 400 when creating a location', () => {
      mockRequest = {
        body: {
          latitude: 1.0,
          longitude: 1.0,
        },
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the createLocation method with the mock request and response
      locationController.createLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('getLocation', () => {
    it('should return the requested location', () => {
      // Create an instance of the LocationController
      mockRequest = {
        params: {
          locationId: '1',
        },
      } as unknown as Request;

      // Call the getLocation method with the mock request and response
      locationController.getLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return Not Found for a non-existing location', () => {
      // Update the mock request to have a non-existing locationId
      mockRequest = {
        params: {
          locationId: '999',
        },
      } as unknown as Request;

      // Call the getLocation method with the mock request and response
      locationController.getLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    //400
    it('should return 400 when getting a location', () => {
      // Create an instance of the LocationController
      mockRequest = {
        params: {
          locationId: '1',
        },
      } as unknown as Request;

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getLocation method with the mock request and response
      locationController.getLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('updateLocation', () => {
    it('should update the existing location', () => {
      mockRequest = {
        params: {
          locationId: '1',
        },
        body: {
          owner: 'John Doe',
          APILocation: 'abc123',
          remainingCalls: 10,
          suspended: 'false',
        },
      } as unknown as Request;

      // Call the updateLocation method with the mock request and response
      locationController.updateLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Location updated successfully.',
      });
    });

    it('should return Not Found for a non-existing location', () => {
      mockRequest = {
        params: {
          locationId: '1',
        },
        body: {
          owner: 'John Doe',
          APILocation: 'abc123',
          remainingCalls: 10,
          suspended: 'false',
        },
      } as unknown as Request;

      // Update the mock request to have a non-existing locationId
      mockRequest.params.locationId = '999';

      // Call the updateLocation method with the mock request and response
      locationController.updateLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Location does not exist.',
      });
    });

    it('should handle error when updating a location', () => {
      mockRequest = {
        params: {
          locationId: '1',
        },
        body: {
          latitude: 1.0,
          longitude: 1.0,
        },
      } as unknown as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to update location');
      });

      // Call the updateLocation method with the mock request and response
      locationController.updateLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update location',
      });
    });

    //400
    it('should return 400 when updating a location', () => {
      mockRequest = {
        params: {
          locationId: '1',
        },
        body: {
          latitude: 1.0,
          longitude: 1.0,
        },
      } as unknown as Request;
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the updateLocation method with the mock request and response
      locationController.updateLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  describe('deleteLocation', () => {
    const mockRequest = {
      params: {
        locationId: '1',
      },
    } as unknown as Request;
    it('should delete the existing location', () => {
      // Call the deleteLocation method with the mock request and response
      locationController.deleteLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Location deleted successfully.',
      });
    });
    it('should return Not Found for a non-existing location', () => {
      // Update the mock request to have a non-existing locationId
      mockRequest.params.locationId = '999';

      // Call the deleteLocation method with the mock request and response
      locationController.deleteLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Location does not exist.',
      });
    });
    it('should handle error when deleting a location', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to delete location');
      });

      // Call the deleteLocation method with the mock request and response
      locationController.deleteLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete location',
      });
    });
    //400
    it('should return 400 when deleting a location', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the deleteLocation method with the mock request and response
      locationController.deleteLocation(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
});
