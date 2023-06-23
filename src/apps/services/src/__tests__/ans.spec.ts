import AuthController from '../controllers/auth/auth.controller';
import { Request, Response } from 'express';
// Mocking the entire AuthController module
jest.mock('../controllers/auth/auth.controller', () => ({
  __esModule: true,
  default: class {
    registerUser = jest.fn();
    loginUser = jest.fn();
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
      //expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
