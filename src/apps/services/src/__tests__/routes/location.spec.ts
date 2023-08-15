import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import ILocation from '../../models/location.interface';
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
describe('Test the location path', () => {
  it('Test the location router', async () => {
    const response = await request(app).get('/location');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the location router!',
    });
  });

  //create
  it('Test the create location route', async () => {
    const response = await request(app).post('/location/create').send({
      owner: 'test',
      APILocation: 'test',
      remainingCalls: 100,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Location created successfully.',
    });
  });

  //all
  it('Test the get all locations route', async () => {
    const response = await request(app).get('/location/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as ILocation[]);
  });

  //getLocation
  it('Test the get location route', async () => {
    const response = await request(app).get('/location/1');
    expect(response.statusCode).toBe(200);
  });

  //update
  it('Test the update location route', async () => {
    const response = await request(app).patch('/location/update/1').send({
      owner: 'test',
      APILocation: 'test',
      remainingCalls: 100,
      suspended: false,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Location updated successfully.',
    });
  });

  //delete
  it('Test the delete location route', async () => {
    const response = await request(app).delete('/location/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Location deleted successfully.',
    });
  });
});
