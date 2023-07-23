import express from 'express';
import LocationImagesController from '../../controllers/location.images/location.images.controller';
import bodyParser from 'body-parser';

export const locationImagesRouter = express.Router();

locationImagesRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the locationImages router!',
  });
});

const locationImagesController = new LocationImagesController();

locationImagesRouter.get(
  '/getimages',
  bodyParser.json(),
  locationImagesController.getLocationImages
);
