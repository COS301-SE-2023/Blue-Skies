import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ITrainingData from '../../models/training.data.interface';
import { connection as conn } from '../../main';
export default class TrainingDataController {
  public createTrainingData = (req: Request, res: Response) => {
    const { solarIrradiation, image, areaId, date } = req.body;
    const query =
      `INSERT INTO [dbo].[trainingData] (solarIrradiation, image, areaId, date)` +
      ` VALUES (${solarIrradiation}, '${image}', ${areaId}, '${date}')`;

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
              message: 'Training data created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAllTrainingData = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[trainingData]';
    const trainingDataArr: ITrainingData[] = [];

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
              details: 'No training data exists.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(trainingDataArr);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const trainingData: ITrainingData = {
          trainingDataId: columns[0].value,
          solarIrradiation: columns[1].value,
          image: columns[2].value,
          areaId: columns[3].value,
          date: columns[4].value,
        };
        trainingDataArr.push(trainingData);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getTrainingDataByArea = (req: Request, res: Response) => {
    const { areaId } = req.params;
    const query = `SELECT * FROM [dbo].[trainingData] WHERE areaId = ${areaId}`;
    const trainingDataArr: ITrainingData[] = [];

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
              details: 'No training data exists.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(trainingDataArr);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const trainingData: ITrainingData = {
          trainingDataId: columns[0].value,
          solarIrradiation: columns[1].value,
          image: columns[2].value,
          areaId: columns[3].value,
          date: columns[4].value,
        };
        trainingDataArr.push(trainingData);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getTrainingData = (req: Request, res: Response) => {
    const { trainingDataId } = req.params;

    const query = `SELECT * FROM [dbo].[trainingData] WHERE trainingDataId = ${trainingDataId}`;
    let trainingData: ITrainingData;
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
              details: 'Training data does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(trainingData);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        trainingData = {
          trainingDataId: columns[0].value,
          solarIrradiation: columns[1].value,
          image: columns[2].value,
          areaId: columns[3].value,
          date: columns[4].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateTrainingData = (req: Request, res: Response) => {
    const { trainingDataId } = req.params;
    const { solarIrradiation, image, areaId, date } = req.body;
    const query =
      `UPDATE [dbo].[trainingData] SET solarIrradiation = '${solarIrradiation}', image = '${image}', areaId = '${areaId}', date = '${date}'` +
      `WHERE trainingDataId = ${trainingDataId}`;

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
              details: 'Training data does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Training data updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteTrainingData = async (req: Request, res: Response) => {
    const { trainingDataId } = req.params;
    const query = `DELETE FROM [dbo].[trainingData] WHERE trainingDataId = ${trainingDataId}`;

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
              details: 'Training data does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Training data deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
