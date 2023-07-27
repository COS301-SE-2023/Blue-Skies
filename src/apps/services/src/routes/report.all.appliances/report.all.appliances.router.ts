import express from 'express';
import ReportAllApplianceController from '../../controllers/report.all.appliances/report.all.appliances.controller';
import bodyParser from 'body-parser';
export const reportAllApplianceRouter = express.Router();

reportAllApplianceRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the report router!',
  });
});

const reportAllController = new ReportAllApplianceController();
reportAllApplianceRouter.get('/all', reportAllController.getAllReportAllAppliance);
reportAllApplianceRouter.get('/:reportId', reportAllController.getReportAllAppliance);
