import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import IReportAppliance from '../../models/report.appliance.interface';
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

describe('Test the reportAppliance path', () => {
  //test the reportAppliance router
  it('Test the reportAppliance router', async () => {
    const response = await request(app).get('/reportAppliance');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the report appliance router!',
    });
  });
  //create

  // it('It should response the POST method', async () => {
  //   //type, powerUsage
  //   const response = await request(app).post('/reportAppliance/create').send({
  //     reportId: 1,
  //     applianceId: 1,
  //     powerUsage: 1,
  //     durationUser: 24,
  //   });

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual({
  //     message: 'Report appliance created successfully.',
  //   });
  // });

  //all
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAppliance[]);
  });

  //:reportApplianceId
  it('It should response the GET method', async () => {
    const response = await request(app).get(
      '/reportAppliance/getAppliancesInReport/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAppliance[]);
  });

  //getReportsWithAppliance/:applianceId
  it('It should response the GET method', async () => {
    const response = await request(app).get(
      '/reportAppliance/getReportsWithAppliance/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as IReportAppliance[]);
  });

  //:reportId/:applianceId
  it('It should response the GET method', async () => {
    const response = await request(app).get('/reportAppliance/1/1');
    expect(response.statusCode).toBe(200);
  });
  //updateNumberOfAppliances/:reportId/:applianceId
  it('updateNumberOfAppliances ', async () => {
    const response = await request(app)
      .patch('/reportAppliance/updateNumberOfAppliances/1/1')
      .send({
        numberOfAppliances: 1,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance updated successfully.',
    });
  });
  //updateReportId/:reportId
  it('updateReportId ', async () => {
    const response = await request(app)
      .patch('/reportAppliance/updateReportId/1')
      .send({
        newReportId: 1,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance updated successfully.',
    });
  });
  //updateApplianceId/:applianceId
  it('updateApplianceId ', async () => {
    const response = await request(app)
      .patch('/reportAppliance/updateApplianceId/1')
      .send({
        newApplianceId: 1,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance updated successfully.',
    });
  });

  //deleteReportId/:reportId
  it('deleteReportId ', async () => {
    const response = await request(app).delete(
      '/reportAppliance/deleteReportId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance deleted successfully.',
    });
  });

  //deleteApplianceId/:applianceId
  it('deleteApplianceId ', async () => {
    const response = await request(app).delete(
      '/reportAppliance/deleteApplianceId/1'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance deleted successfully.',
    });
  });

  //delete/:reportId/:applianceId
  it('delete ', async () => {
    const response = await request(app).delete('/reportAppliance/delete/1/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Report appliance deleted successfully.',
    });
  });
});
