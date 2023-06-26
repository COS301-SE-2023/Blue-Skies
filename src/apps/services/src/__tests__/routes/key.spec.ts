import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';

import { keyRouter } from '../../routes/key/key.router';

const app = express(); // an instance of an express app, a 'fake' express app

app.use('/key', keyRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/key/key.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createKey: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'Key is created.',
        });
      }),

      getAllKeys: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'All keys are retrieved.',
          });
        }),
      getKey: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'Key is retrieved.',
        });
      }),
      updateKey: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'Key is updated.',
        });
      }),
      deleteKey: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'Key is deleted.',
        });
      }),
    };
  });
});
describe('Test the key path', () => {
  it('Test the key router', async () => {
    const response = await request(app).get('/key');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the key router!',
    });
  });
  //Get all keys
  it('Get All Keys', async () => {
    const response = await request(app).get('/key/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'All keys are retrieved.',
    });
  });

  //Get key
  it('Get Specific key', async () => {
    const response = await request(app).get('/key/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key is retrieved.',
    });
  });

  //Create key
  it('Create key', async () => {
    const response = await request(app).post('/key/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key is created.',
    });
  });

  //Update key

  it('Update key', async () => {
    const response = await request(app).put('/key/update');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key is updated.',
    });
  });

  //Delete key
  it('Delete key', async () => {
    const response = await request(app).delete('/key/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key is deleted.',
    });
  });
});
