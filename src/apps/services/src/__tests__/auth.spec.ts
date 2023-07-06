import AuthController from '../controllers/auth/auth.controller';
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

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    authController = new AuthController();
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

  describe('registerUser', () => {
    beforeAll(() => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          // Simulate a successful query with mock data
          if (query.includes('WHERE keyId = 1')) {
            callback(null, 1);
          } else {
            callback(null, 0);
          }
          const rowCount = 2;

          callback(null, rowCount);
        }
      );
    });
    it('should register a user', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
          userRole: '0',
        },
      };

      authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully.',
      });
    });

    //500 error
    it('should return a 500 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
          userRole: '0',
        },
      };

      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Failed to create key');
      });

      authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create key',
      });
    });

    //400 error
    it('should return a 400 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
          userRole: '0',
        },
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Error creating user'));
        }
      );

      authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error creating user',
      });
    });
  });

  //checkEmail
  describe('checkEmail', () => {
    beforeEach(() => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          if (query.includes('WHERE keyId = 1')) {
            callback(null, 1);
          } else {
            callback(null, 0);
          }
          const rowCount = 2;

          callback(null, rowCount);
        }
      );
    });
    it('should check email', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };

      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email is available.',
      });
    });

    //500 error
    it('should return a 401 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };

      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('Faild to check email');
      });

      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        details: 'Email already exists.',
      });
    });

    it('should return 500 if there is an error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw new Error('An error occured');
      });
      // Call the getAllSystems method with the mock request and response
      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert that the mock response was called with the correct data
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  //updateLastLogin
  describe('updateLastLogin', () => {
    beforeEach(() => {
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          if (query.includes('WHERE keyId = 1')) {
            callback(null, 1);
          } else {
            callback(null, 0);
          }
          const rowCount = 2;

          callback(null, rowCount);
        }
      );
    });
    it('should update last login', () => {
      mockRequest = {
        params: {
          userId: '1',
        },
      };

      authController.updateloggedIn(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User last logged in field updated successfully.',
      });
    });
  });
});
