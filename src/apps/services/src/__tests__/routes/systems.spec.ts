import express from 'express'; // import express
import request from 'supertest'; // import supertest
import ISystem from '../../models/system.interface';
import { systemRouter } from '../../routes/system/system.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/system', systemRouter); // routes

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
    expect(response.statusCode).toBe(404);
  });

  //Get a system
  it('Get a system', async () => {
    const response = await request(app).get('/system/1');
    expect(response.statusCode).toBe(404);
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
    expect(response.statusCode).toBe(404);
  });
});
