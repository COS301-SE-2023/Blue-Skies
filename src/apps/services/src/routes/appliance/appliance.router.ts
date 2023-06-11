import express from 'express';
import ApplianceController from '../../controllers/appliance/appliance.controller';
import bodyParser from 'body-parser';
export const applianceRouter = express.Router();

applianceRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the system router!',
  });
});
