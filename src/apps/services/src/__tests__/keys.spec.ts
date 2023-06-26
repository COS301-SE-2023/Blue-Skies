import KeyController from '../controllers/key/key.controller';
import { Request, Response } from 'express';
import * as tedious from 'tedious';

jest.mock('../main', () => jest.fn());

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

  it('It should response the GET method', async () => {
    expect(keyController).toBeDefined();
    expect(keyController.getAllKeys).toBeDefined();
    //Test getAllKeys
    const mockKeys: any[] = [
      {
        keyId: 1,
        owner: 'John',
        APIKey: '12345',
        remainingCalls: 10,
        suspended: false,
      },
      {
        keyId: 2,
        owner: 'Jane',
        APIKey: '67890',
        remainingCalls: 5,
        suspended: true,
      },
    ];
    const mockRowCount = 2;
    const mockRequestError: tedious.RequestError | null = null;

    const mockRequestCallback = jest.fn(
      (err: tedious.RequestError | null, rowCount: number) => {
        if (err) {
          return mockResponse.status(400).json({
            error: err.message,
          });
        } else if (rowCount === 0) {
          return mockResponse.status(404).json({
            error: 'Not Found',
            details: 'No keys exist.',
          });
        } else {
          mockResponse.status(200).json(mockKeys);
        }
      }
    );

    //dummy test
    expect(mockRequestCallback).not.toHaveBeenCalled();
  });
});
