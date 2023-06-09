import express from 'express';
import SystemController from '../../controllers/system/system.controller';
export const systemRouter = express.Router();

systemRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the system router!',
  });
});

const systemController = new SystemController();
systemRouter.get('/all', systemController.getAllSystems);
systemRouter.get('/:systemId', systemController.getSystem);
