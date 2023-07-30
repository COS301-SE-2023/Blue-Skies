import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IBasicCalculation from '../../models/basic.calculation.interface';
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

describe('basicCalculationRouter', () => {
  // / path
  it('should have a route to /', async () => {
    const response = await request(app).get('/basicCalculation');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Welcome to the basic calculation router!'
    );
  });

  //create
  it('should have a route to create a basic calculation', async () => {
    //systemId, dayLightHours, location, batteryLife
    const response = await request(app).post('/basicCalculation/create').send({
      systemId: 1,
      dayLightHours: 12,
      location: 'test',
      batteryLife: 12,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Basic calculation created successfully.'
    );
  });
  //all
  it('should have a route to get all basic calculations', async () => {
    const response = await request(app).get('/basicCalculation/all');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([] as IBasicCalculation[]);
  });
  //:basicCalculationId
  it('should have a route to get a basic calculation', async () => {
    const response = await request(app).get('/basicCalculation/1');
    expect(response.status).toBe(200);
  });
  //update
  it('should have a route to update a basic calculation', async () => {
    const response = await request(app)
      .patch('/basicCalculation/update/1')
      .send({
        systemId: 1,
        dayLightHours: 12,
        location: 'test',
        batteryLife: 12,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Basic Calculation updated successfully.'
    );
  });

  //delete
  it('should have a route to delete a basic calculation', async () => {
    const response = await request(app).delete('/basicCalculation/delete/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Basic calculation deleted successfully.'
    );
  });
});
