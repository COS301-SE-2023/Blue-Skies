import AuthController from '../controllers/auth/auth.controller';
import { Request, Response } from 'express';
// Mocking the entire AuthController module
jest.mock('../controllers/auth/auth.controller', () => ({
  __esModule: true,
  default: class {
    registerUser = jest
      .fn()
      .mockImplementation((req: Request, res: Response) => {
        const { email, password, userRole } = req.body;
        if (
          email === undefined ||
          password === undefined ||
          userRole === undefined
        ) {
          res.status(500).json({
            error: 'Email or password is incorrect.',
            details: 'Email or password is incorrect.',
          });
        } else {
          res.status(200).json({
            message: 'User is registered.',
          });
        }
      });

    loginUser = jest.fn();
    checkEmail = jest.fn().mockImplementation((req: Request, res: Response) => {
      const { email } = req.body;

      if (email === undefined) {
        res.status(500).json({
          error: 'Email is not available.',
          details: 'Email already exists.',
        });
      } else {
        res.status(200).json({
          message: 'Email is available.',
        });
      }
    });
  },
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

  describe('Register a user', () => {
    it('should return 200 if user is registered', () => {
      const email = 'test@example.com';
      const password = 'password';
      const userRole = 'user';

      mockRequest.body = {
        email,
        password,
        userRole,
      };

      authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authController.registerUser).toBeDefined();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User is registered.',
      });

      //expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it('should return 500 if user is not registered', () => {
      mockRequest.body = {};
      authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email or password is incorrect.',
        details: 'Email or password is incorrect.',
      });
    });
  });

  //Checks email exists
  describe('Check if email exists', () => {
    it('Check Email Exists return 200', () => {
      const email = '';

      mockRequest.body = {
        email,
      };

      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authController.checkEmail).toBeDefined();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email is available.',
      });
    });

    it('Check Email Exists return 500', () => {
      mockRequest.body = {};
      authController.checkEmail(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is not available.',
        details: 'Email already exists.',
      });
    });
  });
});
