import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IKey from '../../models/key.interface';
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
describe('Test the key path', () => {
  it('Test the key router', async () => {
    const response = await request(app).get('/key');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the key router!',
    });
  });

  //create
  it('Test the create key route', async () => {
    const response = await request(app).post('/key/create').send({
      owner: 'test',
      APIKey: 'test',
      remainingCalls: 100,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key created successfully.',
    });
  });

  //all
  it('Test the get all keys route', async () => {
    const response = await request(app).get('/key/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IKey[]);
  });

  //getKey
  it('Test the get key route', async () => {
    const response = await request(app).get('/key/1');
    expect(response.statusCode).toBe(200);
  });

  //update
  it('Test the update key route', async () => {
    const response = await request(app).patch('/key/update/1').send({
      owner: 'test',
      APIKey: 'test',
      remainingCalls: 100,
      suspended: false,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key updated successfully.',
    });
  });

  //delete
  it('Test the delete key route', async () => {
    const response = await request(app).delete('/key/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Key deleted successfully.',
    });
  });
});
