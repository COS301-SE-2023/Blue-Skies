
import { Request, Response } from 'express';
import { connection as conn } from '../../main';
import * as tedious from 'tedious';
import ILocationData from '../../models/location.data.interface';
export default class LocationDataController {
  public getChatBotApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.CHATBOT_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  public getMapBoxApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.MAP_BOX_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public getGoogleApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.GOOGLE_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };


  public createLocationData = async (req: Request, res: Response) => {
    const {
      latitude,
      longitude,
      locationName,
      solarPanelsData,
      satteliteImageData,
      satteliteImageElevationData,
      annualFluxData,
      monthlyFluxData,
      maskData,
      horisonElevationData,
    } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `INSERT INTO [dbo].[locationData] (latitude, longitude, locationName, solarPanelsData, satteliteImageData, satteliteImageElevationData, annualFluxData, monthlyFluxData, maskData, dateCreated, horisonElevationData) VALUES (${lat}, ${long}, '${locationName}', '${solarPanelsData}', '${satteliteImageData}', '${satteliteImageElevationData}', '${annualFluxData}', '${monthlyFluxData}', '${maskData}', '${dateCreated}', '${horisonElevationData}')`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err.message);
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Solar Irradiation created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  public getLocationData = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `SELECT * FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;
    let solarIrradiation: ILocationData;
    console.log('Getting location data ' + lat + ', ' + long);
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log("express error: " + err.message);
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            res.status(200).json(solarIrradiation);
          }
        }
      );

      request.on('row', (columns) => {
        solarIrradiation = {
          latitude: columns[0].value,
          longitude: columns[1].value,
          locationName: columns[2].value,
          solarPanelsData: columns[3].value,
          satteliteImageData: columns[4].value,
          satteliteImageElevationData: columns[5].value,
          annualFluxData: columns[6].value,
          monthlyFluxData: columns[7].value,
          maskData: columns[8].value,
          dateCreated: columns[9].value,
          horisonElevationData: columns[10].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // getInitialLocationData
  public getEssentialData = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));

    const query = `SELECT latitude, longitude, locationName, satteliteImageData, dateCreated FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;

    let solarIrradiation: ILocationData;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            res.status(200).json(solarIrradiation);
          }
        }
      );

      request.on('row', (columns) => {
        solarIrradiation = {
          latitude: columns[0].value,
          longitude: columns[1].value,
          locationName: columns[2].value,
          satteliteImageData: columns[3].value,
          dateCreated: columns[4].value,
          annualFluxData: null,
          monthlyFluxData: null,
          maskData: null,
          solarPanelsData: null,
          satteliteImageElevationData: null,
          horisonElevationData: null,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //delete deleteLocationData
  public deleteLocationData = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `DELETE FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Solar Irradiation deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // check if location data exists
  public checkIfLocationDataExists = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `SELECT latitude, longitude, locationName FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;
    console.log('Checking if location data exists ' + lat + ', ' + long);
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            res.status(200).json({
              message: 'Solar Irradiation found.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
