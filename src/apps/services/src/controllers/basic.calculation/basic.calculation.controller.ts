import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IBasicCalculation from '../../models/basic.calculation.interface';
import { connection as conn } from '../../main';
export default class BasicCalculationController {
  public createBasicCalculation = (req: Request, res: Response) => {
    const { systemId, dayLightHours, location, batteryLife, image } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query =
      `INSERT INTO [dbo].[basicCalculations] (systemId, dayLightHours, location, batteryLife, dateCreated, image)` +
      ` VALUES ('${systemId}', '${dayLightHours}', '${location}', '${batteryLife}', '${dateCreated}', '${image}')`;

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
              message: 'Basic calculation created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAllBasicCalculations = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[basicCalculations]';
    const basicCalculations: IBasicCalculation[] = [];

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
              details: 'No basic calculations exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(basicCalculations);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const basicCalculation: IBasicCalculation = {
          basicCalculationId: columns[0].value,
          systemId: columns[1].value,
          daylightHours: columns[2].value + '',
          location: columns[3].value,
          batteryLife: columns[4].value,
          dateCreated: columns[5].value,
          image: columns[6].value,
        };
        basicCalculations.push(basicCalculation);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve basic calculations.',
        details: 'Database connection error.',
      });
    }
  };

  public getCreatedBasicCalculation = (req: Request, res: Response) => {
    const { systemId, dayLightHours, location } = req.body;
    let basicCalculation: IBasicCalculation;
    const query = `SELECT * FROM [dbo].[basicCalculations] WHERE systemId = ${systemId} AND dayLightHours = '${dayLightHours}' AND location = '${location}'`;

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
              details: 'Basic calculation does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(basicCalculation);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        basicCalculation = {
          basicCalculationId: columns[0].value,
          systemId: columns[1].value,
          daylightHours: columns[2].value + '',
          location: columns[3].value,
          batteryLife: columns[4].value,
          dateCreated: columns[5].value,
          image: columns[6].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getBasicCalculation = (req: Request, res: Response) => {
    const { basicCalculationId } = req.params;
    let basicCalculation: IBasicCalculation;
    const query = `SELECT * FROM [dbo].[basicCalculations] WHERE basicCalculationId = ${basicCalculationId}`;

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
              details: 'Basic calculation does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(basicCalculation);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        basicCalculation = {
          basicCalculationId: columns[0].value,
          systemId: columns[1].value,
          daylightHours: columns[2].value + '',
          location: columns[3].value,
          batteryLife: columns[4].value,
          dateCreated: columns[5].value,
          image: columns[6].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateBasicCalculation = (req: Request, res: Response) => {
    const { basicCalculationId } = req.params;
    const { systemId, dayLightHours, location, batteryLife, image } = req.body;
    const query =
      `UPDATE [dbo].[basicCalculations] SET systemId = '${systemId}', dayLightHours = '${dayLightHours}',` +
      ` location = '${location}', batteryLife = ${batteryLife}, image = '${image}' WHERE basicCalculationId = ${basicCalculationId}`;

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
              details: 'Basic calculation does not exist.',
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
              message: 'Basic Calculation updated successfully.',
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

  public deleteBasicCalculation = async (req: Request, res: Response) => {
    const { basicCalculationId } = req.params;
    const query = `DELETE FROM [dbo].[basicCalculations] WHERE basicCalculationId = ${basicCalculationId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(404).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Basic calculation does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Basic calculation deleted successfully.',
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
