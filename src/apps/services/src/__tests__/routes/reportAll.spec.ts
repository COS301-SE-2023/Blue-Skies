import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IReportAll from '../../models/report.all.interface';

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

describe('Test the reportAll path', () => {
  //test the reportAll router
  it('Test the reportAll router', async () => {
    const response = await request(app).get('/reportAll');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the report router!',
    });
  });
  //all
  it('Test the reportAll/all path', async () => {
    const response = await request(app).get('/reportAll/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAll[]);
  });

  //:reportId
  it('Test the reportAll/:reportId path', async () => {
    const response = await request(app).get('/reportAll/1');
    expect(response.statusCode).toBe(200);
  });

  ///user/:userId
  it('Test the reportAll/user/:userId path', async () => {
    const response = await request(app).get('/reportAll/user/1');
    expect(response.statusCode).toBe(200);
  });
});
