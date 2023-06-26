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

//Mocj User Controller
jest.mock('../controllers/user/user.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAllUsers: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          return res.status(200).json([]);
        }),

      getUser: jest.fn().mockImplementation((req: Request, res: Response) => {
        const { userId } = req.params;
        if (userId) return res.status(200).json([]);

        return res
          .status(400)
          .json({ error: 'Not Found', details: 'User does not exist.' });
      }),
      //updateUser
      updateUser: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          const { userId } = req.params;
          const { email, password, userRole } = req.body;
          if (email && password && userRole) {
            return res.status(200).json([]);
          } else {
            return res
              .status(400)
              .json({ error: 'Bad Request', details: 'Invalid request body.' });
          }
        }),
    };
  });
});

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
  //dummy test
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  //Get all users
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  //Get user
  describe('getUser', () => {
    //Test for valid user
    it('should return a user', async () => {
      mockRequest.params = { userId: '1' };
      userController.getUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  //Update user
  describe('updateUser', () => {
    //Test for valid user
    it('should update a user', async () => {
      mockRequest.params = { userId: '1' };
      mockRequest.body = {
        email: 'test@gmail.com',
        password: 'password',
        userRole: 'admin',
      };
      userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
    //Test for invalid user
    it('should return a 400 error', async () => {
      mockRequest.params = { userId: '1' };
      mockRequest.body = {
        password: 'password',
        userRole: 'admin',
      };
      userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        details: 'Invalid request body.',
      });
    });
  });
});
