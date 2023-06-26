import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { systemRouter } from '../../routes/system/system.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/system', systemRouter); // routes

//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/system/system.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createSystem: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'System is created.',
          });
        }),

      getAllSystems: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'All systems are retrieved.',
          });
        }),
      getSystem: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'System is retrieved.',
        });
      }),
      updateSystem: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'System is updated.',
          });
        }),
      deleteSystem: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'System is deleted.',
          });
        }),
    };
  });
});

describe('Test the system path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/system');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the system router!',
    });
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/system/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'All systems are retrieved.',
    });
  });
  it('It should response the POST method', async () => {
    const response = await request(app).post('/system/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'System is created.',
    });
  });
  it('It should response the PATCH method', async () => {
    const response = await request(app).patch('/system/update/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'System is updated.',
    });
  });
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete('/system/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'System is deleted.',
    });
  });
});
