import express from 'express';
import ReportController from '../../controllers/report/report.controller';
import bodyParser from 'body-parser';
export const reportRouter = express.Router();

reportRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the report router!',
  });
});

const reportController = new ReportController();
reportRouter.post('/create', bodyParser.json(), reportController.createReport);
reportRouter.get('/all', reportController.getAllReports);
