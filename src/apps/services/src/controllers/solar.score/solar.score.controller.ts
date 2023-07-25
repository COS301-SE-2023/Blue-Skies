import { Request, Response } from 'express';
import { spawn } from 'child_process';

export default class SolarScoreController {
  public getMapBoxApiKey = async (req: Request, res: Response) => {
    try {
      const key = process.env.MAP_BOX_API_KEY;
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
        [latitude, longitude, 2022, 3]
      );

      res.json({ result: result });
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
}
