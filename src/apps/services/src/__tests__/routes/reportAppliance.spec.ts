import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { reportApplianceRouter } from '../../routes/report.appliance/report.appliance.router';
import ReportApplianceController from '../../controllers/report.appliance/report.appliance.controller';
const app = express(); // an instance of an express app, a 'fake' express app
app.use('/reportAppliance', reportApplianceRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock(
  '../../controllers/report.appliance/report.appliance.controller',
  () => {
    return jest.fn().mockImplementation(() => {
      return {
        createReportAppliance: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ReportAppliance is created.',
            });
          }),
        getAllReportAppliances: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'All reportAppliances are retrieved.',
            });
          }),
        getAppliancesInReport: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'Appliances in report are retrieved.',
            });
          }),
        getReportsWithAppliance: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'Reports with appliance are retrieved.',
            });
          }),
        getAppliance: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'Appliance is retrieved.',
            });
          }),

        updateReportAppliance: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ReportAppliance is updated.',
            });
          }),
        deleteReportAppliance: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ReportAppliance is deleted.',
            });
          }),
        deleteApplianceId: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ApplianceId is deleted.',
            });
          }),

        deleteReportId: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ReportId is deleted.',
            });
          }),
        updateApplianceId: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ApplianceId is updated.',
            });
          }),
        updateReportId: jest
          .fn()
          .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
              message: 'ReportId is updated.',
            });
          }),
      };
    });
  }
);

describe('Test the reportAppliance path', () => {
  //Test All routes
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the report appliance router!',
    });
  });
  it('It should response the POST method', async () => {
    const response = await request(app).post('/reportAppliance/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ReportAppliance is created.',
    });
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'All reportAppliances are retrieved.',
    });
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/appliance/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance is retrieved.',
    });
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/report/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance is retrieved.',
    });
  });
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/appliances/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Appliance is retrieved.',
    });
  });
  it('It should response the patch method', async () => {
    const response = await request(app).patch(
      '/reportAppliance/updateApplianceId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ApplianceId is updated.',
    });
  });
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete('/reportAppliance/delete/1/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ReportAppliance is deleted.',
    });
  });
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete(
      '/reportAppliance/deleteApplianceId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ApplianceId is deleted.',
    });
  });
  it('It should response the DELETE method', async () => {
    const response = await request(app).delete(
      '/reportAppliance/deleteReportId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ReportId is deleted.',
    });
  });
  it('It should response the patch method', async () => {
    const response = await request(app).patch(
      '/reportAppliance/updateApplianceId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'ApplianceId is updated.',
    });
  });
});
