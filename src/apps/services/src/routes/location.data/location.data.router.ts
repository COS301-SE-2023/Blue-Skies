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

locationDataRouter.get(
  '/getsuntimes',
  bodyParser.json(),
  locationDataController.getSunTimes
);

locationDataRouter.post(
  '/create',
  bodyParser.json({ limit: '10mb' }),
  locationDataController.createSolarIrradiation
);

locationDataRouter.patch(
  '/update/data/:latitude/:longitude',
  bodyParser.json(),
  locationDataController.updateDataLocationData
);

locationDataRouter.patch(
  '/update/image/:latitude/:longitude',
  bodyParser.json({ limit: '10mb' }),
  locationDataController.updateImgLocationData
);

locationDataRouter.patch(
  '/update/daylightHours/:latitude/:longitude',
  bodyParser.json(),
  locationDataController.updateDaylightHoursLocationData
);

locationDataRouter.get(
  '/:latitude/:longitude',
  locationDataController.getSolarIrradiation
);

locationDataRouter.get(
  '/withoutImage/:latitude/:longitude/',
  locationDataController.getSolarIrradiationWithoutImage
);

locationDataRouter.delete(
  '/delete/:latitude/:longitude',
  locationDataController.deleteSolarIrradiation
);

locationDataRouter.get(
  '/solarIrradiationData',
  bodyParser.json(),
  locationDataController.getSolarIrradiationData
);

locationDataRouter.patch(
  '/update/elevationData/:latitude/:longitude',
  bodyParser.json(),
  locationDataController.updateElevationData
);
