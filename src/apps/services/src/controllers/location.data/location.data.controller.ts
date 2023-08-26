import { Request, Response } from 'express';
import { connection as conn } from '../../main';
import * as tedious from 'tedious';
import { spawn } from 'child_process';
import ILocationData from '../../models/location.data.interface';
export default class LocationDataController {
  public getMapBoxApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.MAP_BOX_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error });
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

  public getSunTimes = async (req: Request, res: Response) => {
    console.log('Get Sun Times Python script started');
    const { latitude, longitude } = req.body;
    const currentYear = new Date().getFullYear();
    try {
      const result = await this.executePython('scripts/GetSunTimes.py', [
        latitude,
        longitude,
        currentYear,
      ]);

      const ans: number = parseFloat(result[0]);
      res.json(ans);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //createSolarIrradiation
  public createSolarIrradiation = async (req: Request, res: Response) => {
    const { latitude, longitude, location, daylightHours, image } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const dlh = parseFloat(daylightHours.replace(',', '.'));
    const query = `INSERT INTO [dbo].[locationData] (latitude, longitude, location, data, dateCreated, daylightHours,image, remainingCalls) VALUES (${lat}, ${long}, '${location}', '', '${dateCreated}', ${dlh}, '${image}', 100)`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
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

  //update data inside the LocationData table
  public updateDataLocationData = async (req: Request, res: Response) => {
    const { data, remainingCalls } = req.body;
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `UPDATE [dbo].[locationData] SET data = '${data}', remainingCalls = ${remainingCalls} WHERE latitude = ${lat} AND longitude = ${long}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'updated data in LocationData successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //update daylightHours inside the LocationData table
  public updateDaylightHoursLocationData = async (
    req: Request,
    res: Response
  ) => {
    const { daylightHours } = req.body;
    const { latitude, longitude } = req.params;
    const dlh = parseFloat(daylightHours.replace(',', '.'));
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `UPDATE [dbo].[locationData] SET daylightHours = '${dlh}' WHERE latitude = ${lat} AND longitude = ${long}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'updated daylightHours in LocationData successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //update the image inside the LocationData table
  public updateImgLocationData = async (req: Request, res: Response) => {
    const { image } = req.body;
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `UPDATE [dbo].[locationData] SET image = '${image}' WHERE latitude = ${lat} AND longitude = ${long}`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'updated image in LocationData successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update elevationData inside the LocationData table
  public updateElevationData = async (req: Request, res: Response) => {
    const { elevationData } = req.body;
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `UPDATE [dbo].[locationData] SET elevationData = '${elevationData}' WHERE latitude = ${lat} AND longitude = ${long}`;
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
              message: 'updated elevationData in LocationData successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //get solarIrradiation
  public getSolarIrradiation = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `SELECT * FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;
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
          location: columns[2].value,
          data: columns[3].value,
          dateCreated: columns[4].value,
          daylightHours: columns[5].value,
          image: columns[6].value,
          remainingCalls: columns[7].value,
          elevationData: columns[8].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public getSolarIrradiationWithoutImage = async (
    req: Request,
    res: Response
  ) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `SELECT latitude, longitude, location, data, dateCreated, daylightHours, remainingCalls, elevationData FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;
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
          location: columns[2].value,
          image: '',
          data: columns[3].value,
          dateCreated: columns[4].value,
          daylightHours: columns[5].value,
          remainingCalls: columns[6].value,
          elevationData: columns[7].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //delete solarIrradiation
  public deleteSolarIrradiation = async (req: Request, res: Response) => {
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
      res.status(500).json({ error: error });
    }
  };
  //create a function to execute python script
  private executePython = async (script, args) => {
    const parameters = args.map((arg) => arg.toString());
    const py = spawn('python3', [script, ...parameters]);

    const result = await new Promise((resolve, reject) => {
      let output: string[];

      // Get output from python script
      py.stdout.on('data', (data) => {
        const temp: string = data.toString();
        output = temp.split('\r\n');
      });

      // Handle erros
      py.stderr.on('data', (data) => {
        console.error(`[python] Error occured: ${data}`);
        reject(`Error occured in ${script}`);
      });

      py.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(output);
      });
    });

    return result;
  };

  public getSolarIrradiationData = async (req: Request, res: Response) => {
    console.log('Get Solar Data script started');
    const { latitude, longitude, numYears, numDaysPerYear } = req.body;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const previousYear = new Date().getFullYear() - 1;
    try {
      this.executePython('scripts/solarRadiation.py', [
        lat,
        long,
        previousYear,
        numYears,
        numDaysPerYear,
      ]);

      res.status(200).json({
        message: 'Solar Data retrieved successfully.',
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
}
