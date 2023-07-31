import express from 'express'; // import express
import request from 'supertest'; // import supertest
import bodyParser from 'body-parser';
import router from '../../routes';
import ITrainingData from '../../models/training.data.interface';

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

describe('Test the training data path', () => {
  //Test the training data router
  it('Test the training data router', async () => {
    const response = await request(app).get('/trainingData');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the trainingData router!',
    });
  });

  //create
  it('Test the training data router create', async () => {
    //solarIrradiation, image, areaId, date

    const response = await request(app).post('/trainingData/create').send({
      solarIrradiation: 1,
      image: 'test',
      areaId: 1,
      date: '2021-01-01',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Training data created successfully.',
    });
  });

  //all
  it('Test the training data router get all', async () => {
    const response = await request(app).get('/trainingData/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as ITrainingData[]);
  });

  //area/:areaId
  it('Test the training data router get by area id', async () => {
    const response = await request(app).get('/trainingData/area/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([] as ITrainingData[]);
  });

  //:trainingDataId
  it('Test the training data router get by id', async () => {
    const response = await request(app).get('/trainingData/1');
    expect(response.statusCode).toBe(200);
  });

  //update/:trainingDataId
  it('Test the training data router update by id', async () => {
    const response = await request(app).patch('/trainingData/update/1').send({
      solarIrradiation: 1,
      image: 'test',
      areaId: 1,
      date: '2021-01-01',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Training data updated successfully.',
    });
  });

  //delete/:trainingDataId
  it('Test the training data router delete by id', async () => {
    const response = await request(app).delete('/trainingData/delete/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Training data deleted successfully.',
    });
  });
});
