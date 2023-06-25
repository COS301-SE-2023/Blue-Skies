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
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      checkEmail: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
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
        }),
      updateloggedIn: jest.fn(),
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
    //Test checkEmail with no email
    it('It should response the GET method', async () => {
      const response = await request(app).get('/auth/checkemail');
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: 'Email is not available.',
        details: 'Email already exists.',
      });
    });
  });
});
