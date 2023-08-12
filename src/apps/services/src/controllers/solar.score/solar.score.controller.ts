import { Request, Response } from 'express';
import { connection as conn } from '../../main';
import * as tedious from 'tedious';
import { spawn } from 'child_process';
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

  public getSolarData = async (req: Request, res: Response) => {
    console.log('Get Solar Data script started');
    const { latitude, longitude, numYears, numDaysPerYear, uniqueID } =
      req.body;
    const previousYear = new Date().getFullYear() - 1;
    try {
      this.executePython('scripts/solarRadiation.py', [
        longitude,
        latitude,
        previousYear,
        numYears,
        numDaysPerYear,
        uniqueID,
      ]);

      res.status(200).json({
        message: 'Solar Data retrieved successfully.',
      });
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
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
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
    const { solarIrradiationId } = req.params;
    const query = `UPDATE [dbo].[solarIrradiation] SET data = '${data}', remainingCalls = ${remainingCalls} WHERE solarIrradiationId = ${solarIrradiationId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
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
