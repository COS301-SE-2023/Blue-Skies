import express from 'express';
import ReportAllApplianceController from '../../controllers/report.all.appliances/report.all.appliances.controller';
import bodyParser from 'body-parser';
export const reportAllRouter = express.Router();

reportAllRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the report router!',
  });
});

const reportAllController = new ReportAllApplianceController();
reportAllRouter.get('/all', reportAllController.getAllReportAllAppliance);
reportAllRouter.get('/:reportId', reportAllController.getReportAllAppliance);
reportAllRouter.get('/user/:userId', reportAllController.getUserReportAllAppliance);
