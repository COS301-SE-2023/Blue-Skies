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

solarScoreRouter.get(
  '/getimages/:solarScoreId',
  bodyParser.json(),
  solarScoreController.getLocationImages
);

solarScoreRouter.get('/mapboxkey', solarScoreController.getMapBoxApiKey);

solarScoreRouter.get(
  '/getsuntimes',
  bodyParser.json(),
  solarScoreController.getSunTimes
);

//createSolarScore
solarScoreRouter.post(
  '/create',
  bodyParser.json(),
  solarScoreController.createSolarScore
);

//getSolarScore
solarScoreRouter.get(
  '/getSolarScore/:solarScoreId',
  solarScoreController.getSolarScore
);

//deleteSolarScore
solarScoreRouter.delete(
  '/deleteSolarScore/:solarScoreId',
  bodyParser.json(),
  solarScoreController.deleteSolarScore
);
