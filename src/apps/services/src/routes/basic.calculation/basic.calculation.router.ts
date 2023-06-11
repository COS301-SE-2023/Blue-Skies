import express from 'express';
import BasicCalculationController from '../../controllers/basicCalculation/basic.calculation.controller';
import bodyParser from 'body-parser';
export const basicCalculationRouter = express.Router();

basicCalculationRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the basic calculation router!',
  });
});

const basicCalculationController = new BasicCalculationController();
basicCalculationRouter.post(
  '/create',
  bodyParser.json(),
  basicCalculationController.createBasicCalculation
);
basicCalculationRouter.get(
  '/all',
  basicCalculationController.getAllBasicCalculations
);
basicCalculationRouter.get(
  '/:basicCalculationId',
  basicCalculationController.getBasicCalculation
);
