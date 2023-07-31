import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IReportAllAppliance from '../../models/report.all.appliances.interface';
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

describe('Test the report all appliances path', () => {
  //router
  it('test the router', async () => {
    const response = await request(app).get('/reportAllAppliance');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the report router!',
    });
  });

  //all
  it('respond with 200 for the get all', async () => {
    const response = await request(app).get('/reportAllAppliance/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAllAppliance[]);
  });
  //:reportId
  it('respond with 200 for get appliances by report ID', async () => {
    const response = await request(app).get('/reportAllAppliance/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAllAppliance[]);
  });
});
