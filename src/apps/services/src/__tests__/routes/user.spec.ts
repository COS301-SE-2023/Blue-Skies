import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { userRouter } from '../../routes/user/user.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/user', userRouter); // routes

//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/user/user.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createUser: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'User is created.',
          });
        }),

      getAllUsers: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'All users are retrieved.',
          });
        }),
      getUser: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'User is retrieved.',
        });
      }),
      updateUser: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'User is updated.',
          });
        }),
      deleteUser: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'User is deleted.',
          });
        }),
    };
  });
});

describe('Test the user path', () => {
  it('Test the user router', async () => {
    const response = await request(app).get('/user');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the user router!',
    });
  });
  it('Update a specific user', async () => {
    const response = await request(app).patch('/user/update/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'User is updated.',
    });
  });
  it('Delete a user', async () => {
    const response = await request(app).delete('/user/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'User is deleted.',
    });
  });
  //Get all users
  it('Get All users', async () => {
    const response = await request(app).get('/user/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'All users are retrieved.',
    });
  });

  //Get user
  it('Get a specific user', async () => {
    const response = await request(app).get('/user/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'User is retrieved.',
    });
  });
});
