import express from 'express';
import ReportAllController from '../../controllers/report.all/report.all.controller';
import bodyParser from 'body-parser';
export const reportAllRouter = express.Router();

reportAllRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the report router!',
  });
});

const reportAllController = new ReportAllController();
reportAllRouter.get('/all', reportAllController.getAllReportAll);
reportAllRouter.get('/:reportId', reportAllController.getReportAll);
reportAllRouter.get('/user/:userId', reportAllController.getUserReportAll);
