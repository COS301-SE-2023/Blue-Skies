import express from 'express';
import ApplianceController from '../../controllers/report.appliance/report.appliance.controller';
import bodyParser from 'body-parser';
export const reportApplianceRouter = express.Router();

reportApplianceRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the report appliance router!',
  });
});

const reportApplianceController = new ApplianceController();
reportApplianceRouter.post(
  '/create',
  bodyParser.json(),
  reportApplianceController.createReportAppliance
);
reportApplianceRouter.get(
  '/all',
  reportApplianceController.getAllReportAppliances
);
reportApplianceRouter.get(
  '/getAppliancesInReport/:reportId',
  reportApplianceController.getAppliancesInReport
);
reportApplianceRouter.get(
  '/getReportsWithAppliance/:applianceId',
  reportApplianceController.getReportsWithAppliance
);
reportApplianceRouter.get(
  '/:reportId/:applianceId',
  reportApplianceController.getAppliance
);

