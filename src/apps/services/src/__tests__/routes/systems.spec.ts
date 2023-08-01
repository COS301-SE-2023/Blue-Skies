import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import ISystem from '../../models/system.interface';

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

describe('Test the system path', () => {
  //Test the system router
  it('Test the system router', async () => {
    const response = await request(app).get('/system');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the system router!',
    });
  });

  //Create A system
  it('Create a system', async () => {
    const body = {
      inverterOutput: 1,
      numberOfPanels: 1,
      batterySize: 1,
      numberOfBatteries: 1,
      solarInput: 1,
    };
    const response = await request(app).post('/system/create').send(body);
    expect(response.statusCode).toBe(200);
  });

  //Get all systems
  it('Get all systems', async () => {
    const response = await request(app).get('/system/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as ISystem[]);
  });

  //Get a system
  it('Get a system', async () => {
    const response = await request(app).get('/system/1');
    expect(response.statusCode).toBe(200);
  });

  //Update a system
  it('Update a system', async () => {
    const body = {
      inverterOutput: 1,
      numberOfPanels: 1,
      batterySize: 1,
      numberOfBatteries: 1,
      solarInput: 1,
    };
    const response = await request(app).patch('/system/update/1').send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'System updated successfully.',
    });
  });

  //Delete a system
  it('Delete a system', async () => {
    const response = await request(app).delete('/system/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'System deleted successfully.',
    });
  });
});
