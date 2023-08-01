import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
const app = express(); // an instance of an express app, a 'fake' express app
app.use(bodyParser.json());
app.use('/', router); // routes
//mock the main file
jest.mock('../../main', () => {
  return {
    connection: {
      execSql: jest.fn(),
    },
  };
});

jest.mock('tedious', () => ({
  Request: jest.fn().mockImplementation((query, callback) => {
    callback(null, 1);
  }),
}));

describe('Test the auth path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/auth');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the auth router!' });
  });

  //register
  it('Test the auth router register', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@gmail.com',
      password: 'test',
      userRole: '0',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'User registered successfully.',
    });
  });
});
