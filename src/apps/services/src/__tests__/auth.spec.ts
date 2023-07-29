import AuthController from '../controllers/auth/auth.controller';
import { Request, Response } from 'express';
import IUser from '../models/user.interface';
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
    it('should return a 200 response', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
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
    it('should return a 500 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Failed to check email');
        }
      );

      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to check email',
        details: 'Database connection error.',
      });
    });

    //400 error
    it('should return a 400 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Error checking email'));
        }
      );

      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error checking email',
      });
    });
  });

  //updateloggedIn
  describe('updateLoggedIn', () => {
    it('should return a 200 response', () => {
      mockRequest.params = {
        userId: '1',
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

    //404 error
    it('should return a 404 error', () => {
      mockRequest.params = {
        userId: '0',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Error'));
        }
      );
      authController.updateloggedIn(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error',
      });
    });

    //404 rowcount = 0
    it('should return a 404 error if row count = 0', () => {
      mockRequest.params = {
        userId: '0',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      authController.updateloggedIn(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Not Found',
        details: 'User does not exist.',
      });
    });

    //500 error
    it('should return a 500 error', () => {
      mockRequest.params = {
        userId: '1',
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Failed to update last logged in');
        }
      );
      authController.updateloggedIn(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to update last logged in',
      });
    });
  });

  //loginUser
  describe('loginUser', () => {
    //400
    it('should return a 400 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Error'));
        }
      );
      authController.loginUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error',
      });
    });

    //404
    it('should return a 404 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(null, 0);
        }
      );
      authController.loginUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid email',
        details: 'User does not exist.',
      });
    });

    //500
    it('should return a 500 error', () => {
      mockRequest = {
        body: {
          email: 'test@gmail.com',
          password: 'test',
        },
      };
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          throw new Error('Failed to login user');
        }
      );
      authController.loginUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to login user',
      });
    });

    //200 with correct password
  });
});
