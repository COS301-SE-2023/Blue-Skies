import KeyController from '../controllers/key/key.controller';
import { Request, Response } from 'express';

jest.mock('../main', () => jest.fn());

describe('Test the key path', () => {
  let keyController: KeyController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(() => {
    keyController = new KeyController();
  });
  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('It should response the GET method', async () => {
    expect(keyController).toBeDefined();
    expect(keyController.getAllKeys).toBeDefined();
    expect(keyController.createKey).toBeDefined();
  });
});
