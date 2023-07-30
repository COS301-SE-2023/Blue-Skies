import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IAppliance from '../../models/appliance.interface';
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

describe('Test the appliance path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/appliance');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the appliance router!',
    });
  });

  //create
  it('It should response the POST method', async () => {
    //type, powerUsage
    const response = await request(app).post('/appliance/create').send({
      type: 'test',
      powerUsage: 1,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance created successfully.',
    });
  });
  //all
  it('It should response the GET method', async () => {
    const response = await request(app).get('/appliance/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IAppliance[]);
  });
  //:applianceId
  it('It should response the GET method', async () => {
    const response = await request(app).get('/appliance/1');
    expect(response.statusCode).toBe(200);
  });

  //update
  it('It should response the PATCH method', async () => {
    const response = await request(app).patch('/appliance/update/1').send({
      type: 'test',
      powerUsage: 1,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance updated successfully.',
    });
  });

  //delete
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete('/appliance/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance deleted successfully.',
    });
  });
});
