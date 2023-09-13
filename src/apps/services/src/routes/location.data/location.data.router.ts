import express from 'express';
import LocationDataController from '../../controllers/location.data/location.data.controller';
import bodyParser from 'body-parser';

export const locationDataRouter = express.Router();

locationDataRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the locationImages router!',
  });
});

const locationDataController = new LocationDataController();

locationDataRouter.get('/mapboxkey', locationDataController.getMapBoxApiKey);

locationDataRouter.get(
  '/googlemapskey',
  locationDataController.getGoogleApiKey
);

locationDataRouter.post(
  '/create',
  bodyParser.json({ limit: '10mb' }),
  locationDataController.createLocationData
);

locationDataRouter.get(
  '/:latitude/:longitude',
  locationDataController.getLocationData
);

locationDataRouter.delete(
  '/delete/:latitude/:longitude',
  locationDataController.deleteLocationData
);
