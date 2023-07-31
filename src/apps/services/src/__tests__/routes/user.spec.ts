import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IUser from '../../models/user.interface';
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
  ColumnValue: jest.fn(),
}));

describe('Test the user path', () => {
  it('Test the user router', async () => {
    const response = await request(app).get('/user');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the user router!',
    });
  });

  //all
  it('Test the user router get all', async () => {
    const response = await request(app).get('/user/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IUser[]);
  });

  //:userId
  it('Test the user router get by id', async () => {
    const response = await request(app).get('/user/1');
    expect(response.statusCode).toBe(200);
  });

  //update/:userId
  it('Test the user router update', async () => {
    const response = await request(app).patch('/user/update/1').send({
      email: 'test@gmail.com',
      password: 'test',
      userRole: 0,
    });

    expect(response.statusCode).toBe(200);
  });

  //delete/:userId
  it('Test the user router delete', async () => {
    const response = await request(app).delete('/user/delete/1');
    expect(response.statusCode).toBe(200);
  });
});
