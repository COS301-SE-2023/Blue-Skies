import express from 'express';
import ApplianceController from '../../controllers/appliance/appliance.controller';
import bodyParser from 'body-parser';
export const applianceRouter = express.Router();

applianceRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the appliance router!',
  });
});

const applianceController = new ApplianceController();
applianceRouter.post(
  '/create',
  bodyParser.json(),
  applianceController.createAppliance
);
applianceRouter.get('/all', applianceController.getAllAppliances);
applianceRouter.get('/:applianceId', applianceController.getAppliance);
