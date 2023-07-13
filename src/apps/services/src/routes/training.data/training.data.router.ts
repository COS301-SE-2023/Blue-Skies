import express from 'express';
import TrainingDataController from '../../controllers/training.data/training.data.controller';
import bodyParser from 'body-parser';
export const trainingDataRouter = express.Router();

trainingDataRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the trainingData router!',
  });
});

const trainingDataController = new TrainingDataController();

trainingDataRouter.post(
  '/create',
  bodyParser.json({ limit: '10mb' }),
  trainingDataController.createTrainingData
);
trainingDataRouter.get('/all', trainingDataController.getAllTrainingData);
trainingDataRouter.get(
  '/:trainingDataId',
  trainingDataController.getTrainingData
);
trainingDataRouter.patch(
  '/update/:trainingDataId',
  bodyParser.json(),
  bodyParser.json({ limit: '10mb' }),
  trainingDataController.updateTrainingData
);
trainingDataRouter.delete(
  '/delete/:trainingDataId',
  trainingDataController.deleteTrainingData
);
