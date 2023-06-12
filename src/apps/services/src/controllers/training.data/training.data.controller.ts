import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ITrainingData from '../../models/training.data.interface';
import { connection as conn } from '../../main';
export default class TrainingDataController {
  public createTrainingData = (req: Request, res: Response) => {
    try {
      let { solarIrradiation } = req.body;
      solarIrradiation = Number(solarIrradiation);
      const query =
        `INSERT INTO [dbo].[trainingData] (solarIrradiation)` +
        ` VALUES (${solarIrradiation})`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            return res.status(200).json({
              message: 'Training data created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  };

  public getAllTrainingData = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[trainingData]';
      const trainingDataArr: ITrainingData[] = [];

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const trainingData: ITrainingData = {
          trainingDataId: columns[0].value,
          solarIrradiation: columns[1].value,
        };

        trainingDataArr.push(trainingData);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ trainingData: trainingDataArr });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve training data.',
        details: 'Database connection error.',
      });
    }
  };

  public getTrainingData = (req: Request, res: Response) => {
    const { trainingDataId } = req.params;

    if (!Number.isInteger(Number(trainingDataId))) {
      return res.status(400).json({
        error: 'Invalid trainingDataId',
        details: 'trainingDataId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[trainingData] WHERE trainingDataId = ${trainingDataId}`;

    const request = new tedious.Request(
      query,
      (err: tedious.RequestError, rowCount: number) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        } else if (rowCount === 0) {
          return res.status(401).json({
            error: 'Unauthorized',
            details: 'Training data does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const trainingData: ITrainingData = {
        trainingDataId: columns[0].value,
        solarIrradiation: columns[1].value,
      };
      res.send(trainingData);
    });

    conn.execSql(request);
  };

  public updateTrainingData = (req: Request, res: Response) => {
    const { trainingDataId } = req.params;

    if (!Number.isInteger(Number(trainingDataId))) {
      return res.status(400).json({
        error: 'Invalid trainingDataId',
        details: 'trainingDataId must be an integer.',
      });
    }

    const { solarIrradiation } = req.body;
    try {
      const query =
        `UPDATE [dbo].[trainingData] SET solarIrradiation = '${solarIrradiation}'` +
        `WHERE trainingDataId = ${trainingDataId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(401).json({
              error: 'Unauthorized',
              details: 'Training data does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );
      conn.execSql(request);
      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Training data updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update training data.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteTrainingData = async (req: Request, res: Response) => {
    const { trainingDataId } = req.params;

    if (!Number.isInteger(Number(trainingDataId))) {
      return res.status(400).json({
        error: 'Invalid trainingDataId',
        details: 'trainingDataId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[trainingData] WHERE trainingDataId = ${trainingDataId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(401).json({
              error: 'Unauthorized',
              details: 'Training data does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Training data deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find training data to delete.',
        details: 'Database connection error.',
      });
    }
  };
}
