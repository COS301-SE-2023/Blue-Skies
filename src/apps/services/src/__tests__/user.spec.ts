import UserController from '../controllers/user/user.controller';
import IUser from '../models/user.interface';
// import { connection } from '../main';
import { Request, Response } from 'express';
import * as tedious from 'tedious';
jest.mock('../main', () => jest.fn());
//Mock connection.execSql
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
describe('User Controller', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeAll(() => {
    userController = new UserController();
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

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  //Get All Users
  describe('Get all users', () => {
    it('should return a list of users', () => {
      userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([] as IUser[]);
    });
    //should return 500 if there is an error
    it('should return 500 if there is an error', () => {
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
    //should return 500 if there is an error in the request
    it('should return 500 if there is an error in the request', () => {
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });

    //400
    it('should return 400 if there is an error in the request', () => {
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      userController.getAllUsers(
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

  //Get User
  describe('Get user', () => {
    it('should return a user', () => {
      mockRequest.params = {
        userId: '1',
      };
      userController.getUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    //should return 500 if there is an error
    it('should return 500 if there is an error', () => {
      mockRequest.params = {
        userId: '1',
      };
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.getUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
    //should return 500 if there is an error in the request
    it('should return 500 if there is an error in the request', () => {
      mockRequest.params = {
        userId: '1',
      };
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.getUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });

    //400
    it('should return 400 if there is an error in the request', () => {
      mockRequest.params = {
        userId: '1',
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('Mock Error'));
        }
      );
      userController.getUser(mockRequest as Request, mockResponse as Response);
      // Assert that the status and json methods were called with the correct values
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Mock Error',
      });
    });
  });
  //Update User
  describe('Update user', () => {
    it('should update a user', () => {
      mockRequest.params = {
        userId: '1',
      };
      mockRequest.body = {
        email: 'test@gmail.com',
        password: 'test',
        userRole: '0',
      };
      userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User updated successfully.',
      });
    });

    //should return 500 if there is an error in the request
    it('should return 500 if there is an error in the request', () => {
      mockRequest.params = {
        userId: '1',
      };
      mockRequest.body = {
        email: 'test@gmail.com',
        password: 'test',
        userRole: '0',
      };
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });

    //should return 404 if there is an error
    it('should return 404 if there is an error', () => {
      mockRequest.params = {
        userId: '1',
      };
      mockRequest.body = {
        email: 'test@gmail.com',
        password: 'test',
        userRole: '0',
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('User not found.'));
        }
      );
      userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found.',
      });
    });
  });

  //Delete User
  describe('Delete user', () => {
    it('should delete a user', () => {
      mockRequest.params = {
        userId: '1',
      };
      userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User deleted successfully.',
      });
    });

    //should return 500 if there is an error in the request
    it('should return 500 if there is an error in the request', () => {
      mockRequest.params = {
        userId: '1',
      };
      const error = new Error('Server Error');
      jest.spyOn(tedious, 'Request').mockImplementationOnce(() => {
        throw error;
      });
      userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });

    //should return 404 if there is an error
    it('should return 404 if there is an error', () => {
      mockRequest.params = {
        userId: '1',
      };
      // Mock the connection to throw an error
      (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
        (query, callback) => {
          callback(new Error('User not found.'));
        }
      );
      userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found.',
      });
    });
  });
});
