import express from 'express';
import LocationController from '../../controllers/location/location.controller';
import bodyParser from 'body-parser';
export const locationRouter = express.Router();

locationRouter.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the location router!',
  });
});

const locationController = new LocationController();
locationRouter.post(
  '/create',
  bodyParser.json(),
  locationController.createLocation
);
locationRouter.get('/all', locationController.getAllLocations);
locationRouter.get('/:locationId', locationController.getLocation);
locationRouter.patch(
  '/update/:locationId',
  bodyParser.json(),
  locationController.updateLocation
);
locationRouter.delete('/delete/:locationId', locationController.deleteLocation);
