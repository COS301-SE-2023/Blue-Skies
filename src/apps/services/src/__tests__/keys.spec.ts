import KeyController from '../controllers/key/key.controller';
import { Request, Response } from 'express';
import { request } from 'http';
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

describe('Test the Key Controller', () => {
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

  describe('getAllKeys', () => {
    it('should return all keys', () => {
      // Call the getAllKeys method with the mock request and response
      keyController.getAllKeys(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should handle error when getting all keys', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to get keys');
      });

      // Call the getAllKeys method with the mock request and response
      keyController.getAllKeys(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get keys',
      });
    });

    //400
    it('should return 400 when getting all keys', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAllKeys method with the mock request and response
      keyController.getAllKeys(
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

  // getAllBusinessKeys
  describe('getAllBusinessKeys', () => {
    // should return all business keys
    it('should return all business keys', () => {
      keyController.getAllBusinessKeys(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    // should handle error when getting all business keys
    it('should handle error when getting all business keys', () => {
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to get business keys');
      });

      // Call the getAllBusinessKeys method with the mock request and response
      keyController.getAllBusinessKeys(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to get business keys',
      });
    });

    // should return 400 when getting all business keys
    it('should return 400 when getting all business keys', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getAllBusinessKeys method with the mock request and response
      keyController.getAllBusinessKeys(
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

      // Call the createKey method with the mock request and response
      keyController.createKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create key',
      });
    });

    //400
    it('should return 400 when creating a key', () => {
      mockRequest = {
        body: {
          owner: 'John Doe',
          APIKey: 'abc123',
          remainingCalls: 10,
        },
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the createKey method with the mock request and response
      keyController.createKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // createBusinessKey
  describe('createBusinessKey', () => {
    // should return 200 when creating a business key
    it('should create a new business key', () => {
      // owner, APIKey, remainingCalls, isBusiness, description, location, website, phoneNumber, email
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };

      // Call the createBusinessKey method with the mock request and response
      keyController.createBusinessKey(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Key created successfully.',
      });
    });

    // should return 500 when creating a business key
    it('should handle error when creating a business key', () => {
      // owner, APIKey, remainingCalls, isBusiness, description, location, website, phoneNumber, email
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };
      // Mock the Request constructor to throw an error
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create key');
      });

      // Call the createBusinessKey method with the mock request and response
      keyController.createBusinessKey(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create key',
      });
    });

    // should return 400 when creating a business key
    it('should return 400 when creating a business key', () => {
      // owner, APIKey, remainingCalls, isBusiness, description, location, website, phoneNumber, email
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the createBusinessKey method with the mock request and response
      keyController.createBusinessKey(
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

    //400
    it('should return 400 when getting a key', () => {
      // Create an instance of the KeyController
      mockRequest = {
        params: {
          keyId: '1',
        },
      } as unknown as Request;

      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the getKey method with the mock request and response
      keyController.getKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
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

      // Call the updateKey method with the mock request and response
      keyController.updateKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update key',
      });
    });

    //400
    it('should return 400 when updating a key', () => {
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
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the updateKey method with the mock request and response
      keyController.updateKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });

  // updateBusinessKey
  describe('updateBusinessKey', () => {
    // should return 200 when updating a business key
    it('should update the existing business key', () => {
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };

      // Call the updateBusinessKey method with the mock request and response
      keyController.updateBusinessKey(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Key updated successfully.',
      });
    });

    // should return 404 when updating a business key
    it('should return Not Found for a non-existing business key', () => {
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );

      // Call the updateBusinessKey method with the mock request and response
      keyController.updateBusinessKey(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'Key does not exist.',
      });
    });

    // should return 500 when updating a business key
    it('should handle error when updating a business key', () => {
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Mock Error');
        }
      );

      // Call the updateBusinessKey method with the mock request and response
      keyController.updateBusinessKey(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });

    // should return 400 when updating a business key
    it('should return 400 when updating a business key', () => {
      mockRequest.params = {
        keyId: '1',
      };
      mockRequest.body = {
        owner: 'John Doe',
        APIKey: 'abc123',
        remainingCalls: 10,
        isBusiness: true,
        description: 'This is a description',
        location: 'This is a location',
        website: 'This is a website',
        phoneNumber: 'This is a phone number',
        email: 'This is an email',
      };

      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the updateBusinessKey method with the mock request and response
      keyController.updateBusinessKey(
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

      // Call the deleteKey method with the mock request and response
      keyController.deleteKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to delete key',
      });
    });
    //400
    it('should return 400 when deleting a key', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );

      // Call the deleteKey method with the mock request and response
      keyController.deleteKey(mockRequest as Request, mockResponse as Response);

      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
});
