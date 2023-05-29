import request from 'supertest';
import express from 'express';
import router from '../routes';

const app = express();
app.use(router);

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.header['content-type']).toEqual(
      expect.stringContaining('text/html')
    );
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });

  it('Testing the user router', async () => {
    const res = await request(app).get('/user');
    console.log(res.body);
    expect(res.header['content-type']).toEqual(
      expect.stringContaining('application/json')
    );
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ message: 'Welcome to the user router!' });
  });
});
