import { Request, Response } from 'express';
import { connection as conn } from '../../main';
import * as tedious from 'tedious';
import { spawn } from 'child_process';
import ISolarIrradiation from '../../models/solar.irradiation.interfact';
export default class SolarScoreController {
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
    const { latitude, longitude } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `INSERT INTO [dbo].[solarIrradiation] (data, remainingCalls, latitude, longitude, dateCreated) VALUES ('', 0, ${latitude}, ${longitude}, '${dateCreated}')`;
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
      res.status(500).json({ error: error });
    }
  };

  //update solarIrradiation
  public updateSolarIrradiation = async (req: Request, res: Response) => {
    const { data, remainingCalls } = req.body;
    const { latitude, longitude } = req.params;
    const query = `UPDATE [dbo].[solarIrradiation] SET data = '${data}', remainingCalls = ${remainingCalls} WHERE latitude = ${latitude} AND longitude = ${longitude}`;

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
              message: 'Solar Irradiation updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //get solarIrradiation
  public getSolarIrradiation = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    console.log(latitude, longitude);
    const query = `SELECT * FROM [dbo].[solarIrradiation] WHERE latitude = ${latitude} AND longitude = ${longitude}`;
    let solarIrradiation: ISolarIrradiation;
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
          data: columns[0].value,
          remainingCalls: columns[1].value,
          latitude: columns[2].value,
          longitude: columns[3].value,
          dateCreated: columns[4].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //delete solarIrradiation
  public deleteSolarIrradiation = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const query = `DELETE FROM [dbo].[solarIrradiation] WHERE latitude = ${latitude} AND longitude = ${longitude}`;

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
}
