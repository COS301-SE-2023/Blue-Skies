import AuthController from '../controllers/auth/auth.controller';
import { Request, Response } from 'express';
// Mocking the entire AuthController module
jest.mock('../controllers/auth/auth.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
    };
  });
});

// Mocking the tedious package
jest.mock('tedious', () => ({
  Request: jest.fn().mockImplementation((query, callback) => {
    // Simulate successful execution
    callback(null, 1);
  }),
}));

// Mocking the connection object
const mockExecSql = jest.fn();
const mockConn = {
  execSql: mockExecSql,
};

// Mocking the '../../main' module
jest.mock('../main', () => ({
  connection: {
    conn: mockConn,
  },
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(() => {
    // Mocking the tedious module
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
    //dummy test
    it('1+1', () => {
      expect(1 + 1).toEqual(2);
    });
  });
});
