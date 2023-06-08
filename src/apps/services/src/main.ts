/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import router from './routes/index';
import * as tedious from 'tedious';
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

export const config = {
  server: process.env.AZURE_SQL_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
    },
  },
  options: {
    encrypt: true,
    database: process.env.AZURE_SQL_DB,
  },
};

export const connection = new tedious.Connection(config);
connection.on('connect', async function (err) {
  if (err) {
    console.log('Error', err);
  } else console.log('Connected');
});

connection.connect();
// console.log('🚀 ~ file: main.ts:36 ~ connection:', connection);

app.use('/api', router);
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to services!' });
});
