import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IReport from '../../models/report.interface';

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

describe('Test the report path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/report');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the report router!',
    });
  });

  it('It should response the POST method', async () => {
    const response = await request(app).post('/report/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report created successfully.',
    });
  });
  //all
  it('Test the get all reports route', async () => {
    const response = await request(app).get('/report/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReport[]);
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/report/1');
    expect(response.statusCode).toBe(200);
  });
  it('It should response the PATCH method', async () => {
    const response = await request(app).patch('/report/update/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report updated successfully.',
    });
  });
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete('/report/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report deleted successfully.',
    });
  });

  //getUserReports
  it('Test the get user reports route', async () => {
    const response = await request(app).get('/report/getUserReports/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReport[]);
  });
});
