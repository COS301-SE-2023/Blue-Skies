import express from 'express';
import BasicCalculationController from '../../controllers/basic.calculation/basic.calculation.controller';
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
  bodyParser.json({ limit: '10mb' }),
  basicCalculationController.createBasicCalculation
);
basicCalculationRouter.get(
  '/all',
  basicCalculationController.getAllBasicCalculations
);
basicCalculationRouter.get(
  '/getCreated',
  bodyParser.json(),
  basicCalculationController.getCreatedBasicCalculation
);
basicCalculationRouter.get(
  '/:basicCalculationId',
  basicCalculationController.getBasicCalculation
);
basicCalculationRouter.patch(
  '/update/:basicCalculationId',
  bodyParser.json({ limit: '10mb' }),
  basicCalculationController.updateBasicCalculation
);
basicCalculationRouter.delete(
  '/delete/:basicCalculationId',
  basicCalculationController.deleteBasicCalculation
);
