import KeyController from '../controllers/key/key.controller';
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

describe('Test the key path', () => {
  let keyController: KeyController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    keyController = new KeyController();
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

  describe('KeyController', () => {
    describe('getAllKeys', () => {
      it('should return all keys', () => {
        // Create an instance of the KeyController
        const keyController = new KeyController();

        // Call the getAllKeys method with the mock request and response
        keyController.getAllKeys(
          mockRequest as Request,
          mockResponse as Response
        );

        // Assert that the status and json methods were called with the correct values
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([]);
      });
    });
  });

  //Create a test for the createKey method
  describe('createKey', () => {
    it('should create a new key', () => {
      mockRequest = {
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
        },
      };
      // Call the createKey method with the mock request and response
      keyController.createKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Key created successfully.',
      });
    });

    it('should handle error when creating a key', () => {
      mockRequest = {
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
        },
      };
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create key');
      });

      // Create an instance of the KeyController
      const keyController = new KeyController();

      // Call the createKey method with the mock request and response
      keyController.createKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create key',
      });
    });
  });

  describe('getKey', () => {
    it('should return the requested key', () => {
      // Create an instance of the KeyController
      mockRequest = {
        params: {
          keyId: '1',
        },
      } as unknown as Request;

      // Call the getKey method with the mock request and response
      keyController.getKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return Not Found for a non-existing key', () => {
      // Update the mock request to have a non-existing keyId
      mockRequest = {
        params: {
          keyId: '999',
        },
      } as unknown as Request;

      // Call the getKey method with the mock request and response
      keyController.getKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateKey', () => {
    it('should update the existing key', () => {
      mockRequest = {
        params: {
          keyId: '1',
        },
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
          suspended: 'false',
        },
      } as unknown as Request;

      // Call the updateKey method with the mock request and response
      keyController.updateKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Key updated successfully.',
      });
    });

    it('should return Not Found for a non-existing key', () => {
      mockRequest = {
        params: {
          keyId: '1',
        },
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
          suspended: 'false',
        },
      } as unknown as Request;

      // Update the mock request to have a non-existing keyId
      mockRequest.params.keyId = '999';

      // Call the updateKey method with the mock request and response
      keyController.updateKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Key does not exist.',
      });
    });

    it('should handle error when updating a key', () => {
      mockRequest = {
        params: {
          keyId: '1',
        },
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
          suspended: 'false',
        },
      } as unknown as Request;
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to update key');
      });

      // Create an instance of the KeyController
      const keyController = new KeyController();

      // Call the updateKey method with the mock request and response
      keyController.updateKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update key',
      });
    });
  });

  describe('deleteKey', () => {
    const mockRequest = {
      params: {
        keyId: '1',
      },
    } as unknown as Request;
    it('should delete the existing key', () => {
      // Call the deleteKey method with the mock request and response
      keyController.deleteKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Key deleted successfully.',
      });
    });
    it('should return Not Found for a non-existing key', () => {
      // Update the mock request to have a non-existing keyId
      mockRequest.params.keyId = '999';

      // Call the deleteKey method with the mock request and response
      keyController.deleteKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Key does not exist.',
      });
    });
    it('should handle error when deleting a key', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to delete key');
      });

      // Create an instance of the KeyController
      const keyController = new KeyController();

      // Call the deleteKey method with the mock request and response
      keyController.deleteKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete key',
      });
    });
  });
});
