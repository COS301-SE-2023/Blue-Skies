import express from 'express';
import SolarScoreController from '../../controllers/solar.score/solar.score.controller';
import bodyParser from 'body-parser';

export const solarScoreRouter = express.Router();

solarScoreRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the locationImages router!',
  });
});

const solarScoreController = new SolarScoreController();

solarScoreRouter.get('/mapboxkey', solarScoreController.getMapBoxApiKey);

solarScoreRouter.get('/googlemapskey', solarScoreController.getGoogleApiKey);

solarScoreRouter.get(
  '/getsuntimes',
  bodyParser.json(),
  solarScoreController.getSunTimes
);

solarScoreRouter.get(
  '/getsolardata',
  bodyParser.json(),
  solarScoreController.getSolarData
);

solarScoreRouter.post(
  '/create',
  bodyParser.json(),
  solarScoreController.createSolarIrradiation
);

solarScoreRouter.patch(
  '/update/:solarIrradiationId',
  bodyParser.json(),
  solarScoreController.updateSolarIrradiation
);
