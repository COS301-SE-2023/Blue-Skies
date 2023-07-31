import { Request, Response } from 'express';
import { spawn } from 'child_process';
import * as tedious from 'tedious';
import { connection as conn } from '../../main';
import ISolarScore from '../../models/solar.score.interface';
export default class SolarScoreController {
  public getMapBoxApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.MAP_BOX_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
  public getLocationImages = async (req: Request, res: Response) => {
    console.log('Python script started');
    const { latitude, longitude } = req.body;
    //solarScoreId from req.params
    const solarScoreId = req.params.solarScoreId;
    //Get current year
    const currentYear = new Date().getFullYear();

    try {
      const result = await this.executePython('scripts/getImageBase64.py', [
        latitude,
        longitude,
        currentYear - 1,
        1,
        solarScoreId,
      ]);

      res.json({ result: result });
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
  private executePython = async (script, args) => {
    const parameters = args.map((arg) => arg.toString());
    const py = spawn('python', [script, ...parameters]);

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

  public createSolarScore = async (req: Request, res: Response) => {
    const { solarScoreId, solarScore } = req.body;
    const query = `INSERT INTO [dbo].[solarScore] (solarScoreId, solarScore) VALUES ('${solarScoreId}', '${solarScore}')`;
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
              message: 'Report created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public getSolarScore = async (req: Request, res: Response) => {
    const { solarScoreId } = req.params;
    const query = `SELECT * FROM [dbo].[solarScore] WHERE solarScoreId = '${solarScoreId}'`;
    const solarScores: ISolarScore[] = [];
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'No Calculations left',
            });
          } else {
            console.log(rowCount);
            return res.status(200).json(solarScores);
          }
        }
      );

      request.on('row', (columns) => {
        const solarScore: ISolarScore = {
          solarScoreId: columns[0].value,
          score: columns[1].value,
        };
        solarScores.push(solarScore);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public deleteSolarScore = async (req: Request, res: Response) => {
    const { solarScoreId } = req.params;
    const query = `DELETE FROM [dbo].[solarScore] WHERE solarScoreId = '${solarScoreId}'`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'No Calculations left',
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
              message: 'Report deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
}
