import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { authRouter } from '../../routes/auth/auth.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/auth', authRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/auth/auth.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      registerUser: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'User is registered.',
          });
        }),

      loginUser: jest.fn().mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          message: 'User is logged in.',
        });
      }),
      checkEmail: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'Email is available.',
          });
        }),
      updateloggedIn: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'User is updated.',
          });
        }),
    };
  });
});

describe('Test the auth path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/auth');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the auth router!' });
  });

  //Test checkEmail
  describe('Test the checkEmail path', () => {
    it('It should response the GET method', async () => {
      const response = await request(app)
        .get('/auth/checkemail')
        .send({ email: 'testemail@gmail.com' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Email is available.' });
    });
  });

  //Test registerUser
  describe('Test the registerUser path', () => {
    it('It should response the POST method', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@gmail.com',
        password: 'test',
        userRole: 'test',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'User is registered.' });
    });
  });

  //Test loginUser
  describe('Test the loginUser path', () => {
    it('It should response the GET method', async () => {
      const response = await request(app).get('/auth/login').send({
        email: 'test@gmail.com',
        password: 'test',
      });
      expect(response.statusCode).toBe(200);
    });
  });

  //Test updateloggedIn
  describe('Test the updateloggedIn path', () => {
    it('It should response the PATCH method', async () => {
      const response = await request(app).patch('/auth/lastLoggedIn/1').send({
        email: '',
        password: 'test',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'User is updated.' });
    });
  });
});
