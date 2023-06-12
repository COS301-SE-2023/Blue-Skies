import express from 'express';
import ImageController from '../../controllers/image/image.controller';
import bodyParser from 'body-parser';
export const imageRouter = express.Router();

imageRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the image router!',
  });
});

const imageController = new ImageController();
imageRouter.post('/create', bodyParser.json(), imageController.createImage);
imageRouter.get('/all', imageController.getAllImages);
imageRouter.get('/:imageId', imageController.getImage);
imageRouter.patch(
  '/update/:imageId',
  bodyParser.json(),
  imageController.updateImage
);
imageRouter.delete('/delete/:imageId', imageController.deleteImage);
