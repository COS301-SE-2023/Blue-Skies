import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ILocation from '../../models/location.interface';
import { connection as conn } from '../../main';
export default class LocationController {
  public createLocation = (req: Request, res: Response) => {
    const { location, latitude, longitude } = req.body;
    const query =
      `INSERT INTO [dbo].[locations] (location, latitude, longitude)` +
      ` VALUES ('${location}', '${latitude}', ${longitude})`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log('Express: Location created successfully.');
            return res.status(200).json({
              message: 'Location created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAllLocations = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[locations]';
    const locations: ILocation[] = [];

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: No locations exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'No locations exist.',
            });
          } else {
            console.log('Express: locations retrieved successfully.');
            res.status(200).json(locations);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const location: ILocation = {
          locationId: columns[0].value,
          location: columns[1].value,
          latitude: columns[2].value,
          longitude: columns[3].value,
        };
        locations.push(location);
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getLocation = (req: Request, res: Response) => {
    const { locationId } = req.params;
    let location: ILocation;
    const query = `SELECT * FROM [dbo].[locations] WHERE locationId = ${locationId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: Location does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Location does not exist.',
            });
          } else {
            console.log('Express: Location retrieved successfully.');
            res.status(200).json(location);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        location = {
          locationId: columns[0].value,
          location: columns[1].value,
          latitude: columns[2].value,
          longitude: columns[3].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateLocation = (req: Request, res: Response) => {
    const { locationId } = req.params;
    const { location, latitude, longitude } = req.body;
    const query =
      `UPDATE [dbo].[locations] SET location = '${location}', latitude = '${latitude}', longitude = '${longitude}'` +
      ` WHERE locationId = ${locationId}`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: Location does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Location does not exist.',
            });
          } else {
            console.log('Express: Location updated successfully.');
            res.status(200).json({
              message: 'Location updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteLocation = async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const query = `DELETE FROM [dbo].[locations] WHERE locationId = ${locationId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: Location does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Location does not exist.',
            });
          } else {
            console.log('Express: Location deleted successfully.');
            res.status(200).json({
              message: 'Location deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
