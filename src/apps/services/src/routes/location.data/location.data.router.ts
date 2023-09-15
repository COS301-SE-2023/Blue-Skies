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
  '/chatbotapikey',
  locationDataController.getChatBotApiKey
);

locationDataRouter.get(
  '/googlemapskey',
  locationDataController.getGoogleApiKey
);

locationDataRouter.post(
  '/create',
  bodyParser.json({ limit: '50mb' }),
  locationDataController.createLocationData
);

locationDataRouter.get(
  '/:latitude/:longitude',
  locationDataController.getLocationData
);

locationDataRouter.get(
  '/essentialData/:latitude/:longitude',
  locationDataController.getEssentialData
);

locationDataRouter.delete(
  '/delete/:latitude/:longitude',
  locationDataController.deleteLocationData
);

locationDataRouter.get(
  '/checkIfLocationDataExists/:latitude/:longitude',
  locationDataController.checkIfLocationDataExists
);
