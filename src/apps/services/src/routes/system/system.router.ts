import express from 'express';
import SystemController from '../../controllers/system/system.controller';
import bodyParser from 'body-parser';
export const systemRouter = express.Router();

systemRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the system router!',
  });
});

const systemController = new SystemController();
systemRouter.post('/create', bodyParser.json(), systemController.createSystem);
systemRouter.get('/all', systemController.getAllSystems);
systemRouter.get('/:systemId', systemController.getSystem);
systemRouter.patch(
  '/update/:systemId',
  bodyParser.json(),
  systemController.updateSystem
);
systemRouter.delete('/delete/:systemId', systemController.deleteSystem);
