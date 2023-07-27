import express from 'express'; // import express
import request from 'supertest'; // import supertest
import router from '../../routes';
import bodyParser from 'body-parser';
import * as tedious from 'tedious';
import { config } from '../../main';
const app = express(); // an instance of an express app, a 'fake' express app
app.use(bodyParser.json());
app.use('/', router); // routes
//mock the main file
jest.mock('../../main');

const connection = new tedious.Connection(config);
// connection.on('connect', async function (err) {
//   if (err) {
//     console.log('Error', err);
//   } else console.log('Connected');
// });
// connection.connect();
describe('Test the key path', () => {
  it('Test the key router', async () => {
    const response = await request(app).get('/key');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the key router!',
    });
    console.log(config);
  });
});
