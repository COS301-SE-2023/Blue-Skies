import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { keyRouter } from '../../routes/key/key.router';
import router from '../../routes';
import bodyParser from 'body-parser';
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

// Mock the dependencies and modules
jest.mock('tedious', () => ({
  Request: jest.fn().mockImplementation((query, callback) => {
    // Simulate a successful query with mock data
    // Simulate a successful query with mock data
    if (query.includes('WHERE keyId = 1')) {
      callback(null, 1);
    } else {
      callback(null, 0);
    }
    const rowCount = 2;

    callback(null, rowCount);
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

  //Get A key
  it('Get a key', async () => {
    const response = await request(app).get('/key/1');
    expect(response.statusCode).toBe(200);
    console.log('Hello: ', response.body);
  });
  //Create A key
  it('Create a key', async () => {
    const body = {
      owner: 'test',
      APIKey: 'test',
      remainingCalls: 1,
    };
    const response = await request(app).post('/key/create').send(body);
    expect(response.statusCode).toBe(200);
  });
  //Update A key
  it('Update a key', async () => {
    const body = {
      owner: 'test',
      APIKey: 'test',
      remainingCalls: 1,
      suspended: 'false',
    };
    const response = await request(app).patch('/key/update/1').send(body);
    expect(response.statusCode).toBe(200);
  });
});
