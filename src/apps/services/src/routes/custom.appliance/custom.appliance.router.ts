import express from 'express';
import CustomAppliancesController from '../../controllers/custom.appliances/custom.appliances.controller';
import bodyParser from 'body-parser';
export const customApplianceRouter = express.Router();

customApplianceRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the custom appliance router!',
  });
});

const customAppliancesController = new CustomAppliancesController();

customApplianceRouter.post(
  '/create',
  bodyParser.json(),
  customAppliancesController.createCustomAppliance
);
