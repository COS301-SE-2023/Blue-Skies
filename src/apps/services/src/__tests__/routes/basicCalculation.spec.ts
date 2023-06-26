import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import BasicCalculationController from '../../controllers/basic.calculation/basic.calculation.controller';
import { basicCalculationRouter } from '../../routes/basic.calculation/basic.calculation.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/basicCalculation', basicCalculationRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the Controller
jest.mock(
  '../../controllers/basic.calculation/basic.calculation.controller',
  () => {
    return jest.fn().mockImplementation(() => {
      return {
        createBasicCalculation: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'BasicCalculation is created.',
            });
          }),
        getAllBasicCalculations: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'All basicCalculations are retrieved.',
            });
          }),
        getBasicCalculation: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'BasicCalculation is retrieved.',
            });
          }),
        updateBasicCalculation: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'BasicCalculation is updated.',
            });
          }),
        deleteBasicCalculation: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'BasicCalculation is deleted.',
            });
          }),
      };
    });
  }
);

describe('basicCalculationRouter', () => {
  it('should have a route to create a basicCalculation', async () => {
    const response = await request(app).post('/basicCalculation/create');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('BasicCalculation is created.');
  });

  it('should have a route to get all basicCalculations', async () => {
    const response = await request(app).get('/basicCalculation/all');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('All basicCalculations are retrieved.');
  });

  it('should have a route to get a basicCalculation', async () => {
    const response = await request(app).get('/basicCalculation/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('BasicCalculation is retrieved.');
  });

  it('should have a route to update a basicCalculation', async () => {
    const response = await request(app).patch('/basicCalculation/update/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('BasicCalculation is updated.');
  });

  it('should have a route to delete a basicCalculation', async () => {
    const response = await request(app).delete('/basicCalculation/delete/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('BasicCalculation is deleted.');
  });
});
