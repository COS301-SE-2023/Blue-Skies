import express from 'express';
import KeyController from '../../controllers/key/key.controller';
import bodyParser from 'body-parser';
export const keyRouter = express.Router();

keyRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the key router!',
  });
});

const keyController = new KeyController();
keyRouter.post('/create', bodyParser.json(), keyController.createKey);
keyRouter.get('/all', keyController.getAllKeys);
keyRouter.get('/:keyId', keyController.getKey);
keyRouter.patch('/update/:keyId', bodyParser.json(), keyController.updateKey);
