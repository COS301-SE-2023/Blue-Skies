import KeyController from '../controllers/key/key.controller';
import { Request, Response } from 'express';
import * as tedious from 'tedious';

jest.mock('../main', () => jest.fn());
// Mock the dependencies and modules
jest.mock('tedious', () => ({
  Request: jest.fn().mockImplementation((query, callback) => {
    // Simulate a successful query with mock data
    const rowCount = 2;
    const keys = [
      { id: 1, name: 'Key 1' },
      { id: 2, name: 'Key 2' },
    ];
    callback(null, rowCount);
  }),
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
});
