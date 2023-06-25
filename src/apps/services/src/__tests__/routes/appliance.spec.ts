import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { applianceRouter } from '../../routes/appliance/appliance.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/appliance', applianceRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/appliance/appliance.controller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createAppliance: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'Appliance is created.',
          });
        }),

      getAllAppliances: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'All appliances are retrieved.',
          });
        }),
      getAppliance: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'Appliance is retrieved.',
          });
        }),
      updateAppliance: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'Appliance is updated.',
          });
        }),
      deleteAppliance: jest
        .fn()
        .mockImplementation((req: Request, res: Response) => {
          res.status(200).json({
            message: 'Appliance is deleted.',
          });
        }),
    };
  });
});

describe('Test the appliance path', () => {
  it('It should response the GET method', async () => {
    const response = await request(app).get('/appliance');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the appliance router!',
    });
  });

  //Test createAppliance
  describe('Test the createAppliance path', () => {
    it('It should response the POST method', async () => {
      const response = await request(app).post('/appliance/create').send({
        name: 'test',
        type: 'test',
        brand: 'test',
        model: 'test',
        serial: 'test',
        price: 1,
        store: 'test',
        purchaseDate: 'test',
        warranty: 'test',
        image: 'test',
        notes: 'test',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Appliance is created.' });
    });
  });

  //Test getAllAppliances
  describe('Test the getAllAppliances path', () => {
    it('It should response the GET method', async () => {
      const response = await request(app).get('/appliance/all');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: 'All appliances are retrieved.',
      });
    });
  });

  //Test getAppliance
  describe('Test the getAppliance path', () => {
    it('It should response the GET method', async () => {
      const response = await request(app).get('/appliance/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: 'Appliance is retrieved.',
      });
    });
  });

  //Test updateAppliance
  describe('Test the updateAppliance path', () => {
    it('It should response the PATCH method', async () => {
      const response = await request(app).patch('/appliance/update/1').send({
        name: 'test',
        type: 'test',
        brand: 'test',
        model: 'test',
        serial: 'test',
        price: 1,
        store: 'test',
        purchaseDate: 'test',
        warranty: 'test',
        image: 'test',
        notes: 'test',
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Appliance is updated.' });
    });
  });

  //Test deleteAppliance
  describe('Test the deleteAppliance path', () => {
    it('It should response the DELETE method', async () => {
      const response = await request(app).delete('/appliance/delete/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Appliance is deleted.' });
    });
  });
});
