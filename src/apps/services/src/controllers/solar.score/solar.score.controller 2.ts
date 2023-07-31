import { Request, Response } from 'express';
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
  public getLocationImages = async (req: Request, res: Response) => {
    console.log('Python script started');
    const { latitude, longitude } = req.body;
    //Get current year
    const currentYear = new Date().getFullYear();

    try {
      const result = await this.executePython(
        'apps/services/src/controllers/solar.score/getImages.py',
        [latitude, longitude, currentYear - 1, 3]
      );

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
      const result = await this.executePython(
        'apps/services/src/controllers/solar.score/GetSunTimes.py',
        [latitude, longitude, currentYear]
      );

      const ans: number = parseFloat(result[0]);
      res.json(ans);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
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
